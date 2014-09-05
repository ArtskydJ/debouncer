debouncer
=============

- [Install](#install)
- [Require](#require)
- [Notes on Stepping](#notes-on-stepping)
- [Debouncer(db, opts)](#debouncerdb-opts)
- [debounce(key, cb)](#debouncekey-cb)
- [Examples](#examples)
- [License](#license)

##Install

With NPM do:

	npm install debouncer
	
#Require

```js
var Debouncer = require('debouncer')
```

#Notes on Stepping

Each time the action is allowed, the internal step number goes up. The step number can be used to determine how long to disallow the action. If the action is disallowed for 1 minute and is not attempted within 2 minutes, the internal step number goes down.

If `delayTimeMs` is set as a function, it will be passed the step number as it's only argument. It is the function that turns the step number into the disallowed length of time.

#Debouncer(db, opts)

Returns a [`debounce()`](#debouncekey-cb) function.

- `db` takes a level db object.
- `opts` takes an object with the following properties:
	- `delayTimeMs` can be a function or a number. If it is a function, the step is passed as it's first parameter. If it is a number, the step is multiplied by it.

#debounce(key, cb)

- `key` takes a string. One key will not cause a different key to get debounced.
- `cb` takes a function with the following arguments:
	- `err` is an error object, or `null`.
	- `allowed` is whether or not the action is allowed.
	- `remaining` is the remaining time (in ms) if the action was not allowed.

#Examples

Use `debounce()` with different keys:

```js
var debounce = Debouncer(database, {
	delayTimeMs: function (n) {
		return 5000 //always allow after 5 seconds
	}
})

var callback = function (err, allowed) {
	if (err) {
		console.warn(err)
	}
	console.log(allowed)
}

debounce('foo', callback) //true (first time)

setTimeout(function () {
	debounce('foo', callback) //false
	debounce('bar', callback) //true, (note 'bar')
}, 2500)

setTimeout(function () {
	debounce('foo', callback) //true, (been over 5 sec since last success)
	debounce('bar', callback) //false, (been under 5 sec since last success)
}, 5100)

setTimeout(function () {
	debounce('foo', callback) //true, (been over 5 sec since last success)
	debounce('bar', callback) //true, (been over 5 sec since last success)
}, 12000)
```

Scaling delay:

```js
var debounce = Debouncer(database, {
	delayTimeMs: function (n) {
		return n*1000 //allow after n seconds (n is the number of successes)
	}
})

var callback = function (err, allowed) {
	if (err) {
		throw err
	}
	console.log(allowed)
}

debounce('foo', callback) //true (will be false until 1 sec after this)
debounce('foo', callback) //false

setTimeout(function () {
	debounce('foo', callback) //false
}, 900)
setTimeout(function () {
	debounce('foo', callback) //true (will be false until 2 sec after this)
}, 1100)

setTimeout(function () {
	debounce('foo', callback) //false
}, 2300)
setTimeout(function () {
	debounce('foo', callback) //false
}, 3000)
setTimeout(function () {
	debounce('foo', callback) //true (will be false until 3 sec after this)
}, 3200)

setTimeout(function () {
	debounce('foo', callback) //true (will be false until 4 sec after this)
}, 6300)

setTimeout(function () {
	debounce('foo', callback) //true (will be false until 5 sec after this)
}, 10400)
```

#License

[VOL](veryopenlicense.com)
