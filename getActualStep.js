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
