var test = require('tape')
var Level = require('level-mem')
var lock = require('level-lock')
var Debouncer = require('..')

test('lock retry works', function (t) {
	t.plan(2)

	var db = Level('whatever')
	var debounce = Debouncer(db, {
		delayTimeMs: function () {
			return 0 //allows everything (no delay)
		}
	})

	var unlock = lock(db, 'wat', 'rw')
	t.equal(typeof unlock, 'function', 'no lock on "wat" right now')

	debounce('wat', function (err, allowed, remaining) {
		t.notOk(err, 'retry worked')
	})
	unlock()
})

test('lock error works', function (t) {
	t.plan(2)

	var db = Level('whatever')
	var debounce = Debouncer(db, {
		delayTimeMs: function () {
			return 0 //allows everything (no delay)
		}
	})

	var unlock = lock(db, 'wat', 'rw')
	t.equal(typeof unlock, 'function', 'no lock on "wat" right now')

	debounce('wat', function (err, allowed, remaining) {
		t.ok(err, 'error')
		unlock()
		t.end()
	})

})
