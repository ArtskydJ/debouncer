var test = require('tap').test
var Level = require('level-mem')
var lock = require('level-lock')
var Debouncer = require('./')
var getActualStep = require('./getActualStep.js')

var defaultStepDelay = function defaultStepDelay(n) {
	var result = n * 1000
	if (result > 3000) {
		result = 3000
	} else if (result < 0) {
		result = 0
	}
	return result
}

var runDebounce = function (ms, expected, t, debounce) {
	setTimeout(function () {
		debounce('thekey', function (err, allowed) {
			t.notOk(err, "No error")
			t.equal(allowed, expected, (expected?'A':'Not a')+'llowed to run at '+ms/1000+' seconds')
		})
	}, ms)
}

test('test decrease function', function (t) {
	var runGetActualStep = function (runOptions) {
		t.equal(
			getActualStep(defaultStepDelay, runOptions.step, runOptions.lastTime, runOptions.currTime),
			runOptions.expected,
			'step number reduced by ' + (runOptions.step - runOptions.expected)
		)
	}

	var testObjects = [
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
	]
	t.plan(testObjects.length)

	testObjects.forEach(runGetActualStep)

	t.end()
})

test('test returning of time remaining', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db,  {delayTimeMs: defaultStepDelay})

	t.plan(5)

	debounce('hi', function () {
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

test('check is defaultStepDelay function works as expected', function (t) {
	var testAgainst =     [0, 1,    2,    5,    100,  1.7, -84, 17]
	var expectedResults = [0, 1000, 2000, 3000, 3000, 1700, 0, 3000]
	t.plan(testAgainst.length)

	for (var i=0; i<testAgainst.length; i++) {
		t.equal(defaultStepDelay(testAgainst[i]), expectedResults[i], 'defaultStepDelay works as expected')
	}
})

test('lock retry works', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {
		delayTimeMs: function () {
			return 0 //allows everything (no delay)
		}
	})

	t.plan(2)

	var unlock = lock(db, 'wat', 'rw')
	t.type(unlock, 'function', 'no lock on "wat" right now')

	debounce('wat', function (err, allowed, remaining) {
		t.notOk(err, 'retry worked')
	})
	unlock()
})


test('lock retry works', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {
		delayTimeMs: function () {
			return 0 //allows everything (no delay)
		}
	})

	t.plan(1)

	lock(db, 'wat', 'rw')
	debounce('wat', function (err, allowed, remaining) {
		t.ok(err, 'error')
		t.end()
	})

})


test('check if debounce function works :)', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: defaultStepDelay})

	var testTimes =       [100,  300,   1000,  1200, 3100,  3300, 6200,  6400, 7200,  9300,  9500]
	var expectedResults = [true, false, false, true, false, true, false, true, false, false, true]
	t.plan(testTimes.length*2) //2 tests in each debounce call

	for (var i=0; i<testTimes.length; i++) {
		runDebounce(testTimes[i], expectedResults[i], t, debounce)
	}
})

test('test if decrease works', function (t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: defaultStepDelay})

	var testTimes =       [100,  1000,  2200, 3300]
	var expectedResults = [true, false, true, true]
	t.plan(testTimes.length*2) //2 tests in each debounce call

	for (var i=0; i<testTimes.length; i++) {
		runDebounce(testTimes[i], expectedResults[i], t, debounce)
	}
})
