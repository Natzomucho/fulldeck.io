/**
 * Shoe object
 */
'use strict';

var Joi = require('joi');

var shoeId = require('./props/shoeId');
var deckDefinition = require('./props/deckDefinition');
var cards = require('./props/cards');

module.exports = Joi.object().keys({
    shoeId: shoeId,
    deckDefinition: deckDefinition,
    cards: cards
});