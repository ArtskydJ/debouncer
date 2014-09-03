var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('./')

var delayTimeThing = require('./defaultStepDelay.js')

test('check if debounce function works :)', function(t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: delayTimeThing}) //delayTimeMs

	var runDebounce = function (ms, expected) {
		setTimeout(function () {
			debounce('thekey', function (err, allowed) {
				t.notOk(err, "No error")
				t.equal(allowed, expected, (expected?'A':'Not a')+'llowed to run at '+ms/1000+' seconds')
			})
		}, ms)
	}

	runDebounce(100, true)   //Since this is the first time: allowed
	runDebounce(900, false)  //Within 1 sec of success: not allowed
	runDebounce(1200, true)  //Over 1 sec after success: allowed
	runDebounce(3100, false) //Within 2 sec of success: not allowed
	runDebounce(3300, true)  //Over 2 sec after success: allowed
	runDebounce(6200, false) //Within 3 sec of success: not allowed
	runDebounce(6400, true)  //Over 3 sec after success: allowed
	runDebounce(9300, false) //Within 3 sec of success: not allowed
	runDebounce(9500, true)  //Over 3 sec after success: allowed
	setTimeout(t.end.bind(t), 9600)
})
