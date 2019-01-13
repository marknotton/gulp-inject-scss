////////////////////////////////////////////////////////////////////////////////
// Inject Sass
////////////////////////////////////////////////////////////////////////////////

'use strict'

const es   = require('event-stream');
const glob = require("fast-glob");
const log  = require('@marknotton/lumberjack');
const path = require('path');

var stream = function(injectMethod){
  return es.map((file, cb) => {
    try {
      file.contents = new Buffer( injectMethod( String(file.contents), path.basename(file.path) ));
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

	let settings = arguments[0];

	let debug = String(Object.values(arguments).filter(argument => typeof argument == 'boolean'));

	let {variables, start, end} = getData(settings)

	let globalVariables = variables
	let globalStart = start
	let globalEnd = end

	if ( debug ) {
		log('Variables', variables)
		log('Imported at start', start)
		log('Imported at end', end)
		log.render()
	}

	// Return Stream Data --------------------------------------------------------

	return stream(function(contents, filename)  {

		let result = globalVariables + globalStart + contents + globalEnd

		filename = filename.replace('.scss', '')

		// If there is a bepoke nested object in the settings whose key matches
		// the same as the filename, apply an additional variables/import.

		if ( filename in settings) {

			let {variables, start, end} = getData(settings[filename])

			// Append the new variables/imports around the global results
			result = globalVariables + variables + globalStart + start + contents + globalEnd + end

			if ( debug ) {
				log('[' + filename + '] Variables', variables)
				log('[' + filename + '] Imported at start', start)
				log('[' + filename + '] Imported at end', end)
				log.render()
			}

		}

		return result

	});
}


// Get the Variable, Start Imports and End Imports -----------------------------

function getData(settings) {

	let results = { variables : '', start : '', end : '' };

	if ( typeof settings == 'object') {

		var { variables, imports } = settings;

		if ( typeof variables !== 'undefined'  ) {

			// Return all the variables as a string
			results['variables'] = getVariables(variables);

		}

		if ( typeof imports !== 'undefined') {

			// Return all items that are not prefixed with a hat character
			results['start'] = getImports(imports.filter(item => !item.startsWith('^')));

			// Return all items that are prefixed with a hat character
			results['end'] = getImports(imports.map(item => {
				return item.startsWith('^') ? item.replace('^', '') : false
			}).filter(item => item));

		}

	}

	return results;
}

// Manage Variables ----------------------------------------------------------

function getVariables(variables) {

	if ( !variables ) {
		return '';
	}

	return String(Object.keys(variables).map(key => {

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

	}).join(' '))

}

// Manage Imports ------------------------------------------------------------

function getImports(imports) {

	let files = glob.sync(imports, {
		transform : (file) => file.replace('_','').split('.').slice(0, -1).join('.')
	});

	let noneGlobbedImports = imports.filter(file => !(/(\!|\*)/.test(file)));

	files = [...noneGlobbedImports, ...files];

	if ( !files.length ) {
		return '';
	}

	let importString = "@import '" + files.join("', '") + "';"

	return String(importString);


}
