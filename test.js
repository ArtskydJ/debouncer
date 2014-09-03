var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('./')

var defaultStepDelay = require('./defaultStepDelay.js')

test('check is defaultStepDelay function works as expected', function (t) {
	var testAgainst =     [0, 1,    2,    5,    100,  1.7, -84, 17]
	var expectedResults = [0, 1000, 2000, 3000, 3000, 1700, 0, 3000]
	t.plan(testAgainst.length)

	for (var i=0; i<testAgainst.length; i++) {
		t.equal(defaultStepDelay(testAgainst[i]), expectedResults[i], 'defaultStepDelay works as expected')
	}
})

test('check if debounce function works :)', function (t) {
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
