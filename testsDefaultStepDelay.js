module.exports = function defaultStepDelay(n) {
	var result = n * 1000
	if (result > 3000) {
		result = 3000
	} else if (result < 0) {
		result = 0
	}
	return result
}