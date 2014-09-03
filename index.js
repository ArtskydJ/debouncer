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
	var debouncerDatabase = sublevel(db).sublevel('debouncer') //change this name to something else...
	var options = xtend(defaultOptions, constructorOptions)
	return function (key, callback) {
		var unlock = lock(debouncerDatabase, key, 'rw')
		if (!unlock) {
			return callback(null, false)
		}
		var cb = function (err, success) {
			unlock()
			callback(err, success)
		}
		debouncerDatabase.get(key, keyDbOptions, function (err, successStats) {
			if (err) {
				if (!err.notFound) { //Found the key
					return cb(err)
				}
				successStats = { //Did not find the key
					timeOfLastSuccess: new Date().getTime(),
					numberOfSuccesses: 0
				}
			}
			var currentTime = new Date().getTime()
			var waitMs = options.delayTimeMs(successStats.numberOfSuccesses)

			if (currentTime >= successStats.timeOfLastSuccess + waitMs) {
				successStats.timeOfLastSuccess = currentTime
				successStats.numberOfSuccesses++
				debouncerDatabase.put(key, successStats, keyDbOptions, function (err) {
					if (err) {
						return cb(err)
					}
					return cb(null, true) //Successful
				})
			}
			return cb(null, false) //Unsuccessful
		})
	}
}
