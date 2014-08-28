var xtend = require('xtend')

var defaultOptions = {

}

module.exports = function (constructorOptions) {
	return function (thisOptions) {
		var options = xtend(defaultOptions, constructorOptions, thisOptions)
		
		return 
	}
}