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

module.exports = function(variables){


	var string = Object.keys(variables).map(key => {

		let value = variables[key];
    let result = null;

		if ( typeof value !== 'undefined') {

      if ( typeof value === 'object' ) {

        result = objectToMap(value);

      } else {

  			result = `${value}`;

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
    return `${key}:${value}`
  }).join(",");

  return `(${props})`;
}
