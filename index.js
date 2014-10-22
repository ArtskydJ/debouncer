var lock = require('level-lock')
var getActualStep = require('./getActualStep.js')
var StepDelay = require('./stepDelay.js')
var xtend = require('xtend')

//keys are sessionid's, properties: lastStepTime, step

module.exports = function Debouncer(db, constructorOptions) {
	var debouncerDatabase = db
	var stepDelay = StepDelay(constructorOptions.delayTimeMs)

	return function debouncer(key, callback, retriedNumber) { //people should only pass in key and callback
		retriedNumber = retriedNumber || 0
		var unlock = lock(debouncerDatabase, key, 'rw')
		if (!unlock) {
			if (retriedNumber >= 3) {
				//Uses process.nexttick in case someone passes 'retriedNumber' a number that is >= 3 when the key is locked.
				//This way their callback always executes in a different stack
				process.nextTick(callback.bind(null, new Error('could not establish lock on '+key), false))
			} else {
				setTimeout(debouncer.bind(null, key, callback, retriedNumber+1), 50)
			}
		} else {
			var cb = function () {
				unlock()
				callback.apply(null, arguments)
			}
			debouncerDatabase.get(key, function (err, stepInfo) {
				if (err && !err.notFound) { //error and found the key
					cb(err)
				} else {
					try { stepInfo = JSON.parse(stepInfo) } catch (e) {}
					stepInfo = xtend({
						lastStepTime: new Date().getTime(),
						step: 0
					}, stepInfo)

					var currentTime = new Date().getTime()
					stepInfo.step = getActualStep(stepDelay, stepInfo.step, stepInfo.lastStepTime, currentTime)
					var waitMs = stepDelay(stepInfo.step)

					if (currentTime >= stepInfo.lastStepTime + waitMs) {
						stepInfo.lastStepTime = currentTime
						stepInfo.step++
						debouncerDatabase.put(key, JSON.stringify(stepInfo), function (err) {
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
