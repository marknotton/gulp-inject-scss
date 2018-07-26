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

var units = ["em", "ex", "%", "px", "cm", "mm", "in", "pt", "pc", "ch", "rem",
						 "vh", "vw", "vmin", "vmax", "cm", "mm", "in", "px", "pt", "pc"];

module.exports = function(variables){


	var string = Object.keys(variables).map(key => {

		let value = variables[key];

		if ( typeof value !== 'undefined') {

			// Check if the value is a string, and has a unit at the end of it.
			// If it does, don't wrap it with quotations
			let unitCheck = units.some((suffix) => {
				return isNaN(value) ? value.endsWith(suffix) : false;
			});

			let result = isNaN(value) && !unitCheck ? `"${value}"` : `${value}`;

			return `$${key}: ${result};`;

		}

	}).join('\n')

	return stream(function(fileContents){
		return String(string) + fileContents;
	});
}
