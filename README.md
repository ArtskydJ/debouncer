debouncer
=============

- [Install](#install)
- [Require](#require)
- [Examples](#examples)
- [License](#license)

##Install

With NPM do:

	npm install debouncer
	
##Require

```js
var Debouncer = require('debouncer')
```

##Examples

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
debounce('foo', callback) //race condition, false

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

##License

[MIT](http://opensource.org/licenses/MIT)
