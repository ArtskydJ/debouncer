module.exports = function StepDelay(delay) {
	if (typeof delay === "number") {
		return function (stepNumber) {
			return stepNumber * delay
		}
	} else if (typeof delay === "object" && Array.isArray(delay)) {
		var arr = Object.create(delay)
		if (arr[0] !== 0) arr.unshift(0)
		return function (stepNumber) {
			var index = Math.round(stepNumber)
			if (index < 0) index = 0
			if (index >= arr.length) index = arr.length-1
			return arr[index]
		}
	} else if (typeof delay === "function") {
		return delay
	} else {
		throw new TypeError("delay is a "+typeof delay+", not a number, array, or function")
	}
}
