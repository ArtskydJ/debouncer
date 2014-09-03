var xtend = require('xtend')
var sublevel = require('level-sublevel')
var lock = require('level-lock')

var defaultOptions = {
	//delayTimeMs: function (n) {return n*1000}
}
var keyDbOptions = {
	keyEncoding: 'utf8',
	valueEncoding: 'json'
}

//use level-ttl-cache to reset count
//keys are sessionid's, properties: time_last_clicked, num_of_successful_clicks

module.exports = function (db, constructorOptions) {
	var thisDb = sublevel(db).sublevel('debouncer') //change this name to something else...
	var options = xtend(defaultOptions, constructorOptions)
	return function (key, callback) {
		var unlock = lock(thisDb, key, 'rw')
		if (!unlock) {
			return callback(null, false)
		}
		var cb = function (err, success) {
			unlock()
			callback(err, success)
		}
		thisDb.get(key, keyDbOptions, function (err, obj) { //change 'obj' to something else.
			if (err) {
				if (!err.notFound) { //Found the key
					return cb(err)
				}
				obj = {       //Did not find the key
					timeOfLastSuccess: new Date().getTime(),
					numberOfSuccesses: 0
				}
			}
			var currentTime = new Date().getTime()
			var waitMs = options.delayTimeMs(obj.numberOfSuccesses)

			if (currentTime >= obj.timeOfLastSuccess + waitMs) {
				obj.timeOfLastSuccess = currentTime
				obj.numberOfSuccesses++
				thisDb.put(key, obj, keyDbOptions, function (err) {
					if (err) {
						return cb(err)
					}
					cb(null, true) //Success
				})
			} else {
				cb(null, false) //Not so much success
			}
		})
	}
}
