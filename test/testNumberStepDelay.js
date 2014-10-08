var test = require('tap').test
var StepDelay = require('../stepDelay.js')

test('check if stepDelay.js with a number works as expected', function (t) {
	var delayer = StepDelay(1000)
	var testObjects = [
		{attempt: 0,   expected: 0},
		{attempt: 1,   expected: 1000},
		{attempt: 2,   expected: 2000},
		{attempt: 5,   expected: 5000},
		{attempt: 100, expected: 100000},
		{attempt: 1.7, expected: 1700},
		{attempt: -84, expected: -84000},
		{attempt: 17,  expected: 17000}
	].forEach(function (testObject) {
		t.equal(delayer(testObject.attempt), testObject.expected, 'StepDelay with a number works as expected')
	})
	t.end()
})
