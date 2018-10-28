////////////////////////////////////////////////////////////////////////////////
// Inject SCSS
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

module.exports = function(variables){

	var string = Object.keys(variables).map(key => {

		let value = variables[key];
    let result = null;

		if ( typeof value !== 'undefined') {

      if ( typeof value === 'object' ) {

        // @see https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties

        if(typeof json !== "object" || Array.isArray(json)){
           // not an object, stringify using native function
          return JSON.stringify(json);
        }

        let props = Object.keys(json).map(key => {
          let value = json[key];
          return `${key}:${value}`
        }).join(",");

        result = `(${props})`;

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
