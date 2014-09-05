var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('..')
var defaultStepDelay = require('../testsDefaultStepDelay.js')

test('test if decrease works', function (t) {
	var debounce = Debouncer(Level('whatever'), {delayTimeMs: defaultStepDelay})

	var runDebounce = function (object) {
		setTimeout(function () {
			debounce('thekey', function (err, allowed) {
				t.notOk(err, "No error")
				t.equal(allowed, object.expected, (object.expected?'A':'Not a')+'llowed to run at '+object.time/1000+' seconds')
			})
		}, object.time)
	}

	var testObjects = [
		{time: 100,  expected:true},
		{time: 1000, expected:false},
		{time: 2200, expected:true},
		{time: 3300, expected:true}
	]
	t.plan(testObjects.length * 2) //2 tests in each debounce call
	testObjects.forEach(runDebounce)
})
