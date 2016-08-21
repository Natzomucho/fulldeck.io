/**
 * ActiveRules helper
 */
'use strict';

// Use Joi for fast and powerful Node validation
const Joi = require('joi');

// Always return Promises!
const Promise = require('bluebird');

// The function we will export
function Schema() {}

// Validate data to a schema
Schema.prototype.valid = valid;


module.exports = new Schema();


/**
 * Validate data to a schema
 *
 * @param data
 * @param schemaName
 * @returns {bluebird|exports|module.exports}
 */
function valid(data, schemaName) {
    // Return promise right away
    return new Promise(
        function (resolve, reject) {
            // Validate the keyObject
            var schema = require('./schema/'+schemaName);
            Joi.validate(data, schema, function (err, value) {
                if(err) {
                    reject(err);
                }
                resolve(value);
            });
        }
    );
}
