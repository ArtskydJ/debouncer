var test = require('tap').test
var getActualStep = require('../getActualStep.js')
var defaultStepDelay = require('../testsDefaultStepDelay.js')

test('test decrease function', function (t) {
	[
		{step: 1, expected: 1, lastTime:0, currTime:1999},
		{step: 1, expected: 0, lastTime:0, currTime:2000},
		{step: 2, expected: 2, lastTime:0, currTime:3999},
		{step: 2, expected: 1, lastTime:0, currTime:4000},
		{step: 2, expected: 1, lastTime:0, currTime:5999},
		{step: 2, expected: 0, lastTime:0, currTime:6000},
		{step: 3, expected: 3, lastTime:0, currTime:5999},
		{step: 3, expected: 2, lastTime:0, currTime:6000},
		{step: 3, expected: 2, lastTime:0, currTime:9999},
		{step: 3, expected: 1, lastTime:0, currTime:10000},
		{step: 3, expected: 1, lastTime:0, currTime:11999},
		{step: 3, expected: 0, lastTime:0, currTime:12000},
		{step: 8, expected: 6, lastTime:0, currTime:12000}
	].forEach(function (testObject) {
		t.equal(
			getActualStep(defaultStepDelay, testObject.step, testObject.lastTime, testObject.currTime),
			testObject.expected,
			'step number reduced by ' + (testObject.step - testObject.expected)
		)
	})
	t.end()
})
