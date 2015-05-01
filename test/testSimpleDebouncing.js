var test = require('tape')
var Level = require('level-mem')
var Debouncer = require('..')
var defaultStepDelay = require('./helpers/defaultStepDelay.js')

test('check if debounce function works :)', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: defaultStepDelay})

	var runDebounce = function (object) {
		setTimeout(function () {
			debounce('thekey', function (err, allowed) {
				t.notOk(err, "No error")
				t.equal(allowed, object.expected, (object.expected?'A':'Not a')+'llowed to run at '+object.time/1000+' seconds')
			})
		}, object.time)
	}

	var testObjects = [
		{time: 100, expected: true},
		{time: 300, expected: false},
		{time: 1000, expected: false},
		{time: 1200, expected: true},
		{time: 3100, expected: false},
		{time: 3300, expected: true},
		{time: 6200, expected: false},
		{time: 6400, expected: true},
		{time: 7200, expected: false},
		{time: 9300, expected: false},
		{time: 9500, expected: true}
	]
	t.plan(testObjects.length * 2) //2 tests in each debounce call
	testObjects.forEach(runDebounce)
})
