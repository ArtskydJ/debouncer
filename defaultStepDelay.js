var delayTimeThing = function (n) {
	var result = n * 1000
	if (result > 5000) {
		result = 5000
	}
	return result
}