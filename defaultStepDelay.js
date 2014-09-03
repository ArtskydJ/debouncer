module.exports = function delayTimeThing(n) {
	var result = n * 1000
	if (result > 3000) {
		result = 3000
	}
	return result
}