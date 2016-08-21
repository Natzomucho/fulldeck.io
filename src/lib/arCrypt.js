/**
 * FullDeck
 */
'use strict';

// Use Joi for fast and powerful Node side JS validation
const Joi = require('joi');

// Always return Promises!
const Promise = require('bluebird');

// Use JOSE standard
const jose = require('node-jose');

// Convenience functions
const _ = require('lodash');

// ActiveRules Schema
const Schema = require('./Schema');

// ActiveRules API Error
const APIError = require('./APIError');

// JSON.stringify w/ alpha presort for consistent object hashing
const stringify = require('json-stable-stringify');

// Shamir's Secret Sharing Algorithm
const sssa = require('sssa-js');

// UUID generator
const uuid = require('uuid4');

// Node Crypto libs, use SSL libs for more performant encryption that straight JS
const crypto = require('crypto');

// Shared encryption algorithm
const sharedEncryptAlgo = 'aes-128-cbc';

// The FullDeck Org signing and encryption keys
const orgKeys = require('../config/keys');

// ============================================================
// Define the Object
// ============================================================

// The function we will export an an object
function arCrypt() {}

// Add properties to the exported functions prototype
arCrypt.prototype.newKeys = newKeys;
arCrypt.prototype.publicKeys = publicKeys;
arCrypt.prototype.encryptEach = encryptEach;
arCrypt.prototype.encrypt = encrypt;

// Export the object
module.exports = new arCrypt();


// ============================================================
// Define the public functions used the object
// ============================================================

/**
 * Provide new sign and encrypyt keys
 *
 * @returns {bluebird|exports|module.exports}
 */
function newKeys() {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Create a keystore
        var keystore = jose.JWK.createKeyStore();

        // Add an encryption key to the keystore
        keystore.generate("EC", "P-521", {use: 'enc'}).
        then(function() {
            // Add a signing key to the keystore
            keystore.generate("EC", "P-521", {use: 'sign'}).
            then(function() {
                // Return the JSON representation of the full key
                resolve(keystore.toJSON(true));
            });
        });
    });
}

/**
 * Provide the organization public sign and enc keys
 *
 * @returns {keys|exports|module.exports}
 */
function publicKeys() {
    // Start with the configured org keys
    const keys = orgKeys;

    // Remove the private key parts
    delete keys[0].d;
    delete keys[1].d;

    // Return the remaining key parts
    return { keys: orgKeys };
}

/**
 * Symmetric encrypt each element of an array
 *
 * @param arr
 * @returns {*}
 */
function encryptEach(arr) {
    // Return many promise
    return Promise.map(arr, function (item) {

        // Promise.map awaits for returned promises
        return encrypt(item);

    }).then(function (arr) {
        // Return collection of split encrypted items
        return arr;
    });
}

/**
 * Encrypt an object, string or array
 *
 * The contents will be replaced with three properties
 * 1. crypted - the encrypted value
 * 2. iv - the initialization vector used.
 * 3. secret - the secret that combined with iv will decrypt
 *
 * @param item
 * @returns {bluebird|exports|module.exports}
 */
function encrypt(item) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {


        item = stringify(item);

        // Create a unique shared key and initialization vector
        var sharedSecret =  newSharedSecret();
        var iv = newIV();

        var cipher = crypto.Cipheriv(sharedEncryptAlgo, sharedSecret, iv);
        var crypted = cipher.update(item, 'utf8', 'base64');
        crypted += cipher.final('base64');

        // Convert the IV to a string
        var ivString = iv.toString('base64');

        // Convert the shared secret to a string
        var sharedSecretString = sharedSecret.toString('base64');

        item  = {
            sharedSecret:  sharedSecretString,
            iv: ivString,
            crypted: crypted
        }

        resolve(item);
    });
}

/**
 * Return a new unique shared key
 */
function newSharedSecret() {
    // Create a completely random secret
    return crypto.randomBytes(16); // 128-bits === 16-bytes
}

/**
 * Return a new unique Initialization Vector
 */
function newIV() {
    // Create a completely random secret
    return crypto.randomBytes(16); // 128-bits === 16-bytes
}



