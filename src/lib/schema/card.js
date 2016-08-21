/**
 * Card object
 */
'use strict';

var Joi = require('joi');

var suit = require('./props/suit');
var seq = require('./props/seq');
var rank = require('./props/rank');

module.exports = Joi.object().keys({
    suit: suit,
    seq: seq,
    rank: rank
});