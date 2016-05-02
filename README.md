debouncer
=============

[![Build Status](https://travis-ci.org/ArtskydJ/debouncer.svg)](https://travis-ci.org/ArtskydJ/debouncer)

# [Demo](http://artskydj.github.io/debouncer/)

# notes on stepping

Each time the action is allowed, the internal step number goes up. The step number can be used to determine how long to disallow the action. If the action is disallowed for 1 minute and is not attempted within 2 minutes, the internal step number goes down.

If `delayTimeMs` is set as a function, it will be passed the step number as it's only argument. It is the function that turns the step number into the disallowed length of time.

# examples

Use `debounce()` with different keys:

```js
var debounce = Debouncer(database, {
	delayTimeMs: function (step) { //ignores step
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
	delayTimeMs: function (step) {
		return step*1000 //allow after `step` seconds (`step` is the number of successes)
	}
	//same as doing the following:
	//delayTimeMs: 1000
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

# api

```js
var Debouncer = require('debouncer')
```

## `Debouncer(db, opts)`

Returns a [`debounce()`](#debouncekey-cb) function.

- `db` takes a level db object.
- `opts` takes an object with the following properties:
	- `delayTimeMs` can be a function, a number, or an array.
		- If it is a function, the step is passed as it's first parameter, and the return value is the delay time. `return func(step)`
		- If it is a number, the return value is the step multiplied by the number. `return number * step`
		- If it is an array, the return value is the array element at the index of step. If step is to large, it defaults to the last element. `return array[step]`

## `debounce(key, cb)`

- `key` takes a string. One key will not cause a different key to get debounced.
- `cb` takes a function with the following arguments:
	- `err` is an error object, or `null`.
	- `allowed` is whether or not the action is allowed.
	- `remaining` is the remaining time (in ms) if the action was not allowed.

# instantiation Examples

### function

Always allow after 5 seconds since last allowance:

```js
var debounce = Debouncer(database, {
	delayTimeMs: function (step) { //ignores `step`
		return 5000
	}
})
```

Allow after a random number of seconds between 0 and step: (I am pretty sure that this is not useful in any way.)

```js
var debounce = Debouncer(database, {
	delayTimeMs: function (step) {
		return Math.floor(Math.random() * step) * 1000
	}
})

```

### number

Add 2 seconds after each allowance:

```js
var debounce = Debouncer(database, {
	delayTimeMs: 2000
})
```

### array

1. Allow right away.
2. Allow after 1 second.
3. Allow after 5 seconds.
4. Allow after 20 seconds.
5. Allow after 20 seconds.
6. Allow after 20 seconds.
7. You get it...

```js
var debounce = Debouncer(database, {
	delayTimeMs: [0, 1000, 5000, 20000]
})
```

This will act like the one above. Element 0 is set to 0, but the original object is not modified.

```js
var debounce = Debouncer(database, {
	delayTimeMs: [1000, 5000, 20000]
})
```

# license

[VOL](http://veryopenlicense.com)
