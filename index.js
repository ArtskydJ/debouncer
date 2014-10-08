var lock = require('level-lock')
var getActualStep = require('./getActualStep.js')
var StepDelay = require('./stepDelay.js')

var keyDbOptions = {
	keyEncoding: 'utf8',
	valueEncoding: 'json'
}

//keys are sessionid's, properties: time_last_clicked, num_of_successful_clicks

module.exports = function Debouncer(db, constructorOptions) {
	var debouncerDatabase = db
	var stepDelay = StepDelay(constructorOptions.delayTimeMs)

	return function debouncer(key, callback, retryNumber) { //people should only pass in key and callback
		retryNumber = retryNumber || 0
		var unlock = lock(debouncerDatabase, key, 'rw')
		if (!unlock) {
			if (retryNumber >= 3) {
				//Uses process.nexttick in case someone passes in a retryNumber
				//larger than 3 when the key is locked.
				//This way their callback will always execute in a different
				//stack, avoiding confusion and angry programmers. :)
				process.nextTick(callback.bind(null, new Error('could not establish lock on '+key), false))
			} else {
				setTimeout(debouncer.bind(null, key, callback, retryNumber+1), 50)
			}
		} else {
			var cb = function () {
				unlock()
				callback.apply(null, arguments)
			}
			debouncerDatabase.get(key, keyDbOptions, function (err, stepInfo) {
				if (err && !err.notFound) { //error and found the key
					cb(err)
				} else {
					if (err) { //error of not finding the key
						stepInfo = {
							lastStepTime: new Date().getTime(),
							step: 0
						}
					}

					var currentTime = new Date().getTime()
					stepInfo.step = getActualStep(stepDelay, stepInfo.step, stepInfo.lastStepTime, currentTime)
					var waitMs = stepDelay(stepInfo.step)

					if (currentTime >= stepInfo.lastStepTime + waitMs) {
						stepInfo.lastStepTime = currentTime
						stepInfo.step++
						debouncerDatabase.put(key, stepInfo, keyDbOptions, function (err) {
							err? cb(err) : cb(null, true)
						})
					} else {
						cb(null, false, stepInfo.lastStepTime + waitMs - currentTime) //Unsuccessful
					}
				}
			})
		}
	}
}
