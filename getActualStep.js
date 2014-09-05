module.exports = function getActualStep(delayMs, step, lastStepTime, currentTime) {
	var delay = delayMs(step)
	var elapsedTime = currentTime - lastStepTime
	while ((delay * 2) <= elapsedTime && step > 0) {
		elapsedTime -= (delay * 2)
		step -= 1
		delay = delayMs(step)
	}

	return step
}


/*
//If javascript ever implements tail call optimization, use pretty code below:

module.exports = function getActualStep(delayMs, step, lastStepTime, currentTime) {
	if (step === 0) {
		return step
	}

	var delay = delayMs(step)
	var elapsedTime = currentTime - lastStepTime
	if ((delay * 2) <= elapsedTime) {
		return getActualStep(delayMs, step - 1, lastStepTime, currentTime - delay*2)
	} else {
		return step
	}
}

*/
