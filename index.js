////////////////////////////////////////////////////////////////////////////////
// Inject Sass
////////////////////////////////////////////////////////////////////////////////

'use strict'

const es   = require('event-stream');
const glob = require("fast-glob");
const log = require('@marknotton/lumberjack');

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

let first = true;

let variables = null;
let importAtStart = null;
let importAtEnd = null;
let path = null;
let debug = false;

module.exports = function(){

	if (arguments.length == 0) {
		return '';
	}

	path = String(Object.values(arguments).filter(argument => typeof argument == 'string'));

	// Asign the inject type variable by running through all arguments passed.
	for (var argument of arguments) {
		if (Array.isArray(argument)) {

			// Return all items that are not prefixed with a hat character
			let start = argument.filter(item => !item.startsWith('^'));
			importAtStart = String(getImports(start));

			// Return all itesm are are prefixed with a hat character
			let end = argument.map(item => { return item.startsWith('^') ? item.replace('^', '') : false }).filter(item => item);
			importAtEnd = String(getImports(end));

		} else if (typeof argument == 'boolean') {

			debug = argument;

		} else if (typeof argument != 'string') {

			variables = String(getVariables(argument));

		}
	}

	if ( debug ) {
		log('Variables', variables);
		log('Imported at start', importAtStart);
		log('Imported at end', importAtEnd);

		log.render();
	}

	// Return Stream Data --------------------------------------------------------

	return stream(function(fileContents){
		return variables + importAtStart + fileContents + importAtEnd;
	});
}


// Manage Variables ----------------------------------------------------------

function getVariables(variables) {

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

function getImports(imports) {

	let files = glob.sync(imports, {
		transform : (file) => file.replace(path, '').replace('_','').split('.').slice(0, -1).join('.')
	});

	let noneGlobbedImports = imports.filter(file => !(/(\!|\*)/.test(file)));

	files = [...noneGlobbedImports, ...files];

	let importString = "@import '" + files.join("', '") + "';"

	return importString;


}
