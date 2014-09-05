var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('..')
var defaultStepDelay = require('../testsDefaultStepDelay.js')

test('test returning of time remaining', function (t) {
	var debounce = Debouncer(Level('whatever'),  {delayTimeMs: defaultStepDelay})
	t.plan(5)
	debounce('hi', function () { //run function, then attempt to run it again
		debounce('hi', function (err, allowed, remaining) {
			console.log('this much time is remaining:', remaining)
			t.notOk(err, 'no error')
			t.notOk(allowed, 'not allowed to run; too close to previous call')
			t.type(remaining, 'number', '"remaining" is a number')
			t.ok(remaining>995, 'at least 995 ms remaining')
			t.ok(remaining<=1000, 'less than 1000 ms remaining')
			t.end()
		})
	})
})
