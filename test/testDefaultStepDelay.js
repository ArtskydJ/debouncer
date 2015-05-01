var test = require('tape')
var defaultStepDelay = require('./helpers/defaultStepDelay.js')

test('check if defaultStepDelay function works as expected', function (t) {
	[
		{attempt: 0,   expected: 0},
		{attempt: 1,   expected: 1000},
		{attempt: 2,   expected: 2000},
		{attempt: 5,   expected: 3000},
		{attempt: 100, expected: 3000},
		{attempt: 1.7, expected: 1700},
		{attempt: -84, expected: 0},
		{attempt: 17,  expected: 3000}
	].forEach(function (testObject) {
		t.equal(defaultStepDelay(testObject.attempt), testObject.expected, 'defaultStepDelay works as expected')
	})
	t.end()
})
