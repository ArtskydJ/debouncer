var test = require('tap').test
var Level = require('level-mem')
var Debouncer = require('./')

var delayTimeTing = require('./defaultStepDelay.js')

test('check if debounce function works :)', function(t) {
	var db = Level('whatever')
	var debounce = Debouncer(db, {delayTimeMs: delayTimeThing})

	var runDebounce = function (ms, expected) {
		setTimeout(function () {
			debounce('thekey', function (err, allowed) {
				t.notOk(err, "no errors!")
				t.equal(allowed, expected,
					"wanted:" + expected +
					", found:" + allowed +
					' at ' + ms/1000+' sec'
				)
			})
		}, ms)
	}

	runDebounce( 100, true)  //Since this is the first time, it should be allowed
	runDebounce(1000, false) //Sorry, within 1 sec: not allowed
	runDebounce(1200, true)  //Yay, it's been a second, so it's allowed!
	runDebounce(3100, false) //Whoops, not within 2 secs; not allowed!
	runDebounce(3300, true)  //You guessed it: allowed.
	setTimeout(t.end.bind(t), 3400)
})
