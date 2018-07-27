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
    let result = null;

		if ( typeof value !== 'undefined') {

      if ( typeof value === 'object' ) {
        result = objectToMap(value);

      } else {

        // Check if the value is a string, and has a unit at the end of it.
  			// If it does, don't wrap it with quotations
  			let unitCheck = units.some((suffix) => {
  				return isNaN(value) ? value.endsWith(suffix) : false;
  			});

  			result = isNaN(value) && !unitCheck ? `"${value}"` : `${value}`;

      }

		}

    return `$${key}: ${result};`;

	}).join('\n')

	return stream(function(fileContents){
		return String(string) + fileContents;
	});
}

// see https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
function objectToMap(obj_from_json){
  if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
     // not an object, stringify using native function
    return JSON.stringify(obj_from_json);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  let props = Object.keys(obj_from_json).map(key => {
    let value = obj_from_json[key];

    // Check if the value is a string, and has a unit at the end of it.
    // If it does, don't wrap it with quotations
    let unitCheck = units.some((suffix) => {
      return isNaN(value) ? value.endsWith(suffix) : false;
    });

    let result = isNaN(value) && !unitCheck ? `"${value}"` : `${value}`;

    return `${key}:${result}`
  }).join(",");
  return `(${props})`;
}
