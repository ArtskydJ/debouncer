var sublevel = require('level-sublevel')
var lock = require('level-lock')
var getActualStep = require('./getActualStep.js')

var keyDbOptions = {
	keyEncoding: 'utf8',
	valueEncoding: 'json'
}

//keys are sessionid's, properties: time_last_clicked, num_of_successful_clicks

module.exports = function (db, constructorOptions) {
	var debouncerDatabase = sublevel(db).sublevel('debouncer') //change this name to something else...
	var stepDelay
	if (typeof constructorOptions.delayTimeMs === "number") {
		stepDelay = function (stepNumber) {
			return stepNumber * constructorOptions.delayTimeMs
		}
	} else if (typeof constructorOptions.delayTimeMs === "function") {
		stepDelay = constructorOptions.delayTimeMs
	} else {
		throw new Error("delayTimeMs is not a number or a function")
	}

	return function (key, callback) {
		var unlock = lock(debouncerDatabase, key, 'rw')
		if (!unlock) {
			callback(null, false)
		} else {
			var cb = function (err, success) {
				unlock()
				callback(err, success)
			}
			debouncerDatabase.get(key, keyDbOptions, function (err, successStats) {
				if (err && !err.notFound) { //error and found the key
					cb(err)
				} else {
					if (err) { //error of not finding the key
						successStats = {
							timeOfLastSuccess: new Date().getTime(),
							step: 0
						}
					}

					var currentTime = new Date().getTime()
					successStats.step = getActualStep(stepDelay, successStats.step, successStats.timeOfLastSuccess, currentTime)
					var waitMs = stepDelay(successStats.step)

					if (currentTime >= successStats.timeOfLastSuccess + waitMs) {
						successStats.timeOfLastSuccess = currentTime
						successStats.step++
						debouncerDatabase.put(key, successStats, keyDbOptions, function (err) {
							err? cb(err) : cb(null, true)
						})
					} else {
						cb(null, false) //Unsuccessful
					}
				}
			})
		}
	}
}
