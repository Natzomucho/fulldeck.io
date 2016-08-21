/**
 * Demo PGP object
 */
'use strict';

var Joi = require('joi');

var publicKey = require('./props/publicKey');
var privateKey = require('./props/privateKey');

module.exports = Joi.object().keys({
    publicKey: publicKey,
    privateKey: privateKey
});