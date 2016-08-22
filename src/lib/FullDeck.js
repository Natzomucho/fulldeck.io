/**
 * FullDeck
 */
'use strict';

// Use Joi for fast and powerful Node side JS validation
const Joi = require('joi');

// Always return Promises!
const Promise = require('bluebird');

// Convenience functions
const _ = require('lodash');

// ActiveRules Schema
const Schema = require('./Schema');

// ActiveRules API Error
const APIError = require('./APIError');

// JSON.stringify w/ alpha presort for consistent object hashing
const stringify = require('json-stable-stringify');

// UUID generator
const uuid = require('uuid4');

// Used to copy and object w/o reference
const clone = require('clone');

// Used to copy and object w/o reference
const arCrypt = require('./arCrypt');

// The FullDeck Org signing and encryption keys
const orgKeys = require('../config/keys');

// Default shoe definition
var deckDefinition = {
    suits: ['H','C', 'D', 'S'],
    jokers: 0,
    ranks: ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
};

// ============================================================
// Define the Object
// ============================================================

// The function we will export an an object
function FullDeck() {}

// Add properties to the exported functions prototype
FullDeck.prototype.newKeys = arCrypt.newKeys;
FullDeck.prototype.publicKeys = arCrypt.publicKeys;
FullDeck.prototype.newShoe = newShoe;

// Demo functions to return partially constructed objects
FullDeck.prototype.shuffledShoe = shuffledShoe;
FullDeck.prototype.indexedShoe = indexedShoe;
FullDeck.prototype.encryptedShoe = encryptedShoe;
FullDeck.prototype.splitEncryptedShoe = splitEncryptedShoe;

// Export the object
module.exports = new FullDeck();


// ============================================================
// Define the public functions used the object
// ============================================================

/**
 * Return a signed, encrypted, and shuffled shoe
 * @param data
 */
function newShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Start by making sure we have a valid shoe definition
        defineShoe(data).
        then(function(data){
            return createShoe(data);
        }).
        then(function(data){
            data = arCrypt.convertKeysToObjects(data);
            return data;
        }).
        then(function(data){
            return shuffleShoe(data);
        }).
        then(function(data){
            return indexCards(data);
        }).
        then(function(data){
            return encryptCards(data);
        }).
        then(function(data){
            return splitEncryptSecrets(data);
        }).
        then(function(data){
            return encryptShoe(data);
        }).
        then(function(data){
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}


// ============================================================
// Define the private functions used the object
// ============================================================

/**
 * Encrypt the final shuffled shoe full of encrypted cards
 *
 * @param shoe
 * @returns {bluebird|exports|module.exports}
 */
function encryptShoe(shoe) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {
        // Split secret and encrypt splits for each player
        var keys = shoe.keys;
        delete shoe.keys;
        arCrypt.encryptForeach(shoe, keys).
        then(function(shoe){
            console.log('encryptShoe');
            console.log(new Date());
            resolve(shoe);
        },function(err){
            reject(err);
        })
    });
}

/**
 * Encrypt each card and encrypt the split for the players
 *
 * @param shoe
 * @returns {bluebird|exports|module.exports}
 */
function splitEncryptSecrets(shoe) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {
        // Split secret and encrypt splits for each player
        arCrypt.splitEncryptSecrets(shoe.cards, shoe.keys).
        then(function(secretSplitCards){
            shoe.cards = secretSplitCards;
            console.log('splitEncryptSecrets');
            console.log(new Date());
            resolve(shoe);
        },function(err){
            reject(err);
        })
    });
}

/**
 * Encrypt each card
 * @param shoe
 * @returns {bluebird|exports|module.exports}
 */
function encryptCards(shoe) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {
        // Symmetric encrypt cards, maintaining cardId
        arCrypt.encryptEach(shoe.cards).
        then(function(cards){
            shoe.cards = cards;
            console.log('encryptCards');
            console.log(new Date());
            resolve(shoe);
        },function(err){
            reject(err);
        })
    });
}

/**
 * Index a shuffled deck
 *
 * @param shoe
 * @returns {bluebird|exports|module.exports}
 */
function indexCards(shoe) {
    // Return promise right away
    return new Promise(function (resolve, reject) {

        // Get numbers of cards in shoe
        var shoeSize = shoe.length;

        // Counter to use when looping through shoe
        var shoeCount;

        // Variable for the current card when looping through shoe
        var currentCard;

        // The encrypted version of the currentCard
        var crypted;

        // The sequence of the card in the currentCard in the shoe
        var seq;

        // Get the number of cards in the shoe
        var shoeSize = shoe.cards.length;

        // Hash of card in loop
        var hash;

        // Loop through the shuffled shoe and encrypt the cards.
        for (shoeCount = 0; shoeCount < shoeSize; shoeCount++) {

            // Define the cards sequence in the shoe, don't start at zero.
            seq = shoeCount + 1;

            // Get the current card from the shoe.cards
            currentCard = shoe.cards[shoeCount];

            // Set the sequence for the current card
            currentCard.seq = seq;

            // Add the current card back to the shoe in the same place
            shoe.cards[shoeCount] = currentCard;
        }
        console.log('indexCards');
        console.log(new Date());
        // Resolve the promise with our encrypted deck.
        resolve(shoe);

    });
}

/**
 * Remove elements we don't want to return
 * @param data
 * @returns {bluebird|exports|module.exports}
 * @DEPRECATED
 */
function cleanReturnData(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Remove keys as they were part of the input data
        delete data.keys;

        // Resolve with the current data object
        resolve(data);
    });
}

/**
 * Ensure the shoe is properly defined
 * @param data
 * @returns {bluebird|exports|module.exports}
 */
function defineShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Set number of decks to use if not defined
        if (typeof data.numDecks === 'undefined') {
            data.numDecks = 1;
        }

        // Use any defined deck definition elements
        if (typeof data.deckDefinition != 'undefined') {
            // Purposefully only check for desired properties
            if (typeof data.deckDefinition.suits != 'undefined') {
                deckDefinition.suits = data.deckDefinition.suits;
            }
            if (typeof data.deckDefinition != 'undefined') {
                deckDefinition.ranks = data.deckDefinition.ranks;
            }
            if (typeof data.deckDefinition != 'undefined') {
                deckDefinition.jokers = data.deckDefinition.jokers;
            }
        }

        // Use the final overridden deckDefinition
        data.deckDefinition = deckDefinition;

        // Resolve with the current data object
        resolve(data);
    });
}

/**
 * Create a shoe of some number of decks, based on definition object
 *
 * @param data.deckDefinition
 * @param numDecks
 * @returns {bluebird|exports|module.exports}
 */
function createShoe(data) {

    // Return promise right away
    return new Promise(function (resolve, reject) {

        // Generate a new UUID
        data.shoeId = uuid();

        var numSuits = data.deckDefinition.suits.length;
        var numRank = data.deckDefinition.ranks.length;

        // Reject if people are trying to create crazy large decks
        if(numSuits > 5) {
            reject(new APIError(422, 'There is a maximum of 5 suits per deck.'));
        }
        if(numRank > 20) {
            reject(new APIError(422, 'There is a maximum of 20 card ranks per suit.'));
        }
        if(data.numDecks > 50) {
            reject(new APIError(422, 'There is a maximum of 50 decks per shoe per shoe.'));
        }

        var suitCount;
        var rankCount;
        var newCard;
        var deckCount;
        var jokers = data.deckDefinition.jokers;
        var jokerCount;

        // An array to hold the cards in the shoe
        var cards = new Array();

        // Add each card to first deck in cards
        for (suitCount = 0; suitCount < numSuits; suitCount++) {
            // Loop through each card rank adding it to suit
            for (rankCount = 0; rankCount < numRank; rankCount++) {
                // Create a new card in the deck
                newCard = { rank: data.deckDefinition.ranks[rankCount],suit: data.deckDefinition.suits[suitCount]};
                cards.push(newCard);
            }
        }

        // Add jokers to first deck in cards
        if(jokers > 0) {

            for (jokerCount = 0; jokerCount < jokers; jokerCount++) {
                newCard = { rank: '0', suit: 'J'};
                cards.push(newCard);
            }
        }

        // Clone into Multiple Decks
        if(data.numDecks > 1) {

            // We have one deck already so we ned to clone the total minus 1
            var copiesNeeded = data.numDecks - 1;

            var copy = clone(cards);

            // Clone once and append for each copy needed
            for (deckCount = 0; deckCount < copiesNeeded; deckCount++) {

                copy = clone(copy);

                cards = cards.concat(copy);
            }
        }

        // Create a shoe object and set the cards array
        data.cards = cards;

        // Resolve the promise with the completed shoe
        resolve(data);
    });
}

/**
 * Shuffle a shoe using Fisher-Yates (Knuth) algorithm
 *
 * @param shoe
 * @returns {bluebird|exports|module.exports}
 */
function shuffleShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        var shoeSize = data.cards.length, t, ix;

        // Shuffle using
        while (shoeSize) {

            // Pick a remaining element…
            ix = Math.floor(Math.random() * shoeSize--);

            // And swap it with the current element.
            t = data.cards[shoeSize];
            data.cards[shoeSize] = data.cards[ix];
            data.cards[ix] = t;
        }
        console.log('shuffled');
        console.log(new Date());
        resolve(data);
    });
}

// ============================================================
// Demo functions returning partially constructed objects
// ============================================================

/**
 * Return a shuffled shoe
 * @param data
 */
function shuffledShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Start by making sure we have a valid shoe definition
        defineShoe(data).
        then(function(data){
            return createShoe(data);
        }).
        then(function(data){
            data = arCrypt.convertKeysToObjects(data);
            return data;
        }).
        then(function(data){
            return shuffleShoe(data);
        }).
        then(function(data){
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}

/**
 * Return a shuffled and indexed shoe
 * @param data
 */
function indexedShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Start by making sure we have a valid shoe definition
        defineShoe(data).
        then(function(data){
            return createShoe(data);
        }).
        then(function(data){
            data = arCrypt.convertKeysToObjects(data);
            return data;
        }).
        then(function(data){
            return shuffleShoe(data);
        }).
        then(function(data){
            return indexCards(data);
        }).
        then(function(data){
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}

/**
 * Return a shuffled, indexed and encrypted shoe
 * @param data
 */
function encryptedShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Start by making sure we have a valid shoe definition
        defineShoe(data).
        then(function(data){
            return createShoe(data);
        }).
        then(function(data){
            data = arCrypt.convertKeysToObjects(data);
            return data;
        }).
        then(function(data){
            return shuffleShoe(data);
        }).
        then(function(data){
            return indexCards(data);
        }).
        then(function(data){
            return encryptCards(data);
        }).
        then(function(data){
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}

/**
 * Return a shuffled, indexed and encrypted shoe
 * @param data
 */
function splitEncryptedShoe(data) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Start by making sure we have a valid shoe definition
        defineShoe(data).
        then(function(data){
            return createShoe(data);
        }).
        then(function(data){
            data = arCrypt.convertKeysToObjects(data);
            return data;
        }).
        then(function(data){
            return shuffleShoe(data);
        }).
        then(function(data){
            return indexCards(data);
        }).
        then(function(data){
            return encryptCards(data);
        }).
        then(function(data){
            return splitEncryptSecrets(data);
        }).
        then(function(data){
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}
