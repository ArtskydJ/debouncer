var test = require('tap').test
var StepDelay = require('../stepDelay.js')

test('check if stepDelay.js with an array works as expected', function (t) {
	var delayer = StepDelay([0, 1000, 2000, 3000]);
	[
		{attempt: 0,   expected: 0},
		{attempt: 1,   expected: 1000},
		{attempt: 2,   expected: 2000},
		{attempt: 5,   expected: 3000},
		{attempt: 100, expected: 3000},
		{attempt: 1.7, expected: 2000},
		{attempt: -84, expected: 0},
		{attempt: 17,  expected: 3000}
	].forEach(function (testObject) {
		t.equal(delayer(testObject.attempt), testObject.expected, 'StepDelay with an array works as expected')
	})
	t.end()
})

test('check if stepDelay.js with an array starting w/o a 0 works as expected', function (t) {
	var delayer = StepDelay([1000, 2000, 3000]);
	[
		{attempt: 0,   expected: 0},
		{attempt: 1,   expected: 1000},
		{attempt: 2,   expected: 2000},
		{attempt: 5,   expected: 3000},
		{attempt: 100, expected: 3000},
		{attempt: 1.7, expected: 2000},
		{attempt: -84, expected: 0},
		{attempt: 17,  expected: 3000}
	].forEach(function (testObject) {
		t.equal(delayer(testObject.attempt), testObject.expected, 'StepDelay with an array w/o ele 0 being 0 works')
	})
	t.end()
})

