////////////////////////////////////////////////////////////////////////////////
// Inject Sass
////////////////////////////////////////////////////////////////////////////////

'use strict'

var es = require('event-stream');

var stream = function(injectMethod){
  return es.map(function (file, cb) {
    try {
      file.contents = new Buffer( injectMethod( String(file.contents) ));
    } catch (err) {
			console.warn('Error with Gulp Inject SCSS', err)
    }
    cb(null, file);
  });
};

module.exports = function(){

	if (arguments.length == 0) {
		return '';
	}

	let variables = null;
	let imports = null;

	// Asign the inject type variable by running through all arguments passed.
	for (var argument of arguments) {
		if (Array.isArray(argument)) {
			imports = argument;
		} else {
			variables = argument;
		}
	}

	// Manage Variables ----------------------------------------------------------

	var variablesString = () => {

		if ( !variables ) {
			return '';
		}

		return Object.keys(variables).map(key => {

			let value = variables[key];
	    let result = null;

			if ( typeof value !== 'undefined') {

	      if ( typeof value === 'object' ) {

					if(Array.isArray(value)){
						 // not an object, stringify using native function
						return JSON.stringify(value);
					}
					// Implements recursive object serialization according to JSON spec
					// but without quotes around the keys.
					let props = Object.keys(value).map(key => {
						let value = value[key];
						return `${key}:${value}`
					}).join(",");

					result = `(${props})`;

	      } else {

	  			result = `${value}`;

	      }

			}

	    return `$${key}: ${result};`;

		}).join(' ')

	}

	// Manage Imports ------------------------------------------------------------

	var importsString = () => {

		if ( !imports ) {
			return '';
		}

		let result = [];

		imports.forEach(function (value) {
			result.push(`@import "${value}";`);
		});

		return result.join(' ');

	}

	// Return Stream Data --------------------------------------------------------

	return stream(function(fileContents){
		return String(importsString()) + String(variablesString()) + fileContents;
	});
}
