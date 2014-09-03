var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('./')

var defaultStepDelay = require('./defaultStepDelay.js')

test('check if debounce function works :)', function(t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: defaultStepDelay})

	var runDebounce = function (ms, expected) {
		setTimeout(function () {
			debounce('thekey', function (err, allowed) {
				t.notOk(err, "No error")
				t.equal(allowed, expected, (expected?'A':'Not a')+'llowed to run at '+ms/1000+' seconds')
			})
		}, ms)
	}

	var testTimes =       [100,  300,   1000,  1200, 3100,  3300, 6200,  6400, 7200,  9300,  9500]
	var expectedResults = [true, false, false, true, false, true, false, true, false, false, true]
	t.plan(testTimes.length*2) //2 tests in each debounce call

	for (var i=0; i<testTimes.length; i++) {
		runDebounce(testTimes[i], expectedResults[i])
	}
})
