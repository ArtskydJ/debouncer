debouncer
=============

- [Install](#install)
- [Require](#require)
- [Examples](#examples)
- [License](#license)

##Install
	npm install debouncer
	
##Require
	var Debouncer = require('debouncer')

##Examples

	var debounceFast = Debouncer({
		change: function (n) {
			return n*1000 //seconds
		}
	})

##License

[MIT](http://opensource.org/licenses/MIT)
