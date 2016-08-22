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

// Get new signing and encrypting public/private keys
arCrypt.prototype.newKeys = newKeys;

// Get the Org signing keys
arCrypt.prototype.publicKeys = publicKeys;

// Use a different secret and iv to encrypt each element of an array
arCrypt.prototype.encryptEach = encryptEach;

// Encrypt a single item for multiple recipient keys
arCrypt.prototype.encryptForeach = encryptForeach;

// Encrypt an object with new iv and secret
arCrypt.prototype.encrypt = encrypt;

// Process an array of secret encrypted data, split the secret and encrypt part for each key
arCrypt.prototype.splitEncryptSecrets = splitEncryptSecrets;

// Create keystore objects for all keys up front
arCrypt.prototype.convertKeysToObjects = convertKeysToObjects;

// Export the object
module.exports = new arCrypt();


// ============================================================
// Define the public functions used the object
// ============================================================

/**
 * Secret encrypt the item for multiple keys
 * Secret encrypt the item, then key encrypt the secret
 * @param item
 * @param keys
 *
 * @return
 * {
 *  crypted: {},
 *  secrets: []
 * }
 */
function encryptForeach(item, keys) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {
        encrypt(item, keys).
        then(function(encrypted){
            // We sent keys so the secret will be encrypted for each.
            // We unset the public secret
            delete encrypted.secret;
            resolve(encrypted);
        });
    });
}

/**
 * Replaces an objects JSON `keys` property with key objects
 *
 * @param data
 * @returns {bluebird|exports|module.exports}
 */
function convertKeysToObjects(data) {

    // Return many promise
    return Promise.map(data.keys, function (key) {

        // Promise.map awaits for returned promises
        return keyStore(key);

    }).then(function (keys) {
        // Return collection of split secret encrypted items
        data.keys = keys;
        return data;

    }).catch(function(err) {
        // Return an error if something failed
        return Promise.reject({message: err});
    })
}

/**
 * Return a Keystore
 * @param key
 * @returns {bluebird|exports|module.exports}
 */
function keyStore(key) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {
        // Create a JOSE key object from the JSON key provided
        jose.JWK.asKeyStore(key).then(function (keystore) {
            resolve({
                alias: key.alias,
                keystore: keystore,
                keys: key.keys
            });
        });
    });
}


/**
 * For each item split the secret and encrypt part for each key
 * @param items
 * @param keys
 */
function splitEncryptSecrets(items, keys) {
    // Return many promise
    return Promise.map(items, function (item) {

        // Promise.map awaits for returned promises
        return splitEncryptSecret(item, keys);

    }).then(function (arr) {
        // Return collection of split secret encrypted items
        return arr;

    }).catch(function(err) {
        // Return an error if something failed
        return Promise.reject({message: err});
    })
}

/**
 * For each item encrypt the secret for each key
 * @param items
 * @param keys
 */
function encryptSecrets(items, keys) {

}


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
function encryptEach(arr, keys, split) {
    // Return many promise
    return Promise.map(arr, function (item) {

        // Promise.map awaits for returned promises
        return encrypt(item, keys, split);

    }).then(function (arr) {
        // Return collection of split encrypted items
        return arr;
    }).catch(function(err) {
        // Return an error if something failed
        return Promise.reject({message: err});
    })
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
function encrypt(item, keys, split) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Store the seq before stringifying
        var seq = item.seq || false;

        // Make sure we're encrypting a string
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

        // Define the return item
        item  = {
            secret:  sharedSecretString,
            iv: ivString,
            crypted: crypted
        }

        // Add the sequence to return item if we have one
        if(seq) {
            item.seq = seq;
        }

        // If there were keys provided encrypt the secret for each key
        if(keys) {
            if(split) {
                splitEncryptSecret(item, keys).
                then(function(item) {
                    resolve(item);
                }, function(err) {
                    reject(err);
                });
            } else {
                encryptSecretForeach(item, keys).
                then(function(item) {
                    resolve(item);
                });
            }
        } else {
            resolve(item);
        }
    });
}

/**
 * Encrypt the `secret` property of an object.
 * The secret will be replaced with an array of secrets.
 * Each key will have the full secret encrypted.
 *
 * @param item
 * @param keys
 */
function encryptSecretForeach(item, keys) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        return Promise.map(keys, function (key) {

            // Promise.map awaits for returned promises
            return keyEncrypt(item.secret, key);

        }).then(function (encryptedSecrets) {
            // Return collection of split encrypted items
            delete item.keys;
            item.secrets = encryptedSecrets;
            resolve(item);
        }).catch(function(err) {
            // Return an error if something failed
            reject(err);
        });
    });
}

/**
 * Encrypt the `secret` property of an object.
 * The secret will be replaced with an array of secrets.
 * The secret will be split into as many pieces as there are keys.
 * Each key will have part of the secret encrypted for it.
 *
 * @param item
 * @param keys
 */
function splitEncryptSecret(item, keys) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Number of keys
        var keyCount = _.size(keys);

        // Split the key into a a piece for each key
        var secretSplits = sssa.create(keyCount, keyCount, item.secret);

        // Delete the secret now that we are done with it
        delete item.secret;

        // Encrypt the the split secret parts for the provide keys
        encryptOneForeach(secretSplits, keys).
        then(function(secrets) {
            //item.secrets = secrets;
            resolve(item);
        }, function(err) {
            reject(err);
        });
    });
}

/**
 * This will take an array of items and encrypt one for each key provided.
 * You must have the exact same number of each element
 *
 * @param items
 * @param keys
 */
function encryptOneForeach(arr, keys) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // make sure we have the same number of elements
        if(arr.length != _.size(keys)) {
            var err = new APIError('500', 'Internal Server Error', 'Number of keys did not match the number of splits.');
            reject(err);
        }

        Promise.map(arr, function (item, ix) {

            // Promise.map awaits for returned promises
            return keyEncrypt(item, keys[ix]);

        }).then(function (arr) {
            // Return collection of split encrypted items
            resolve(arr);
        }).catch(function(err) {
            // Return an error if something failed
            reject(err);
        });
    });
}

/**
 * Encrypt an item for a key
 *
 * @param item
 * @param key
 * @returns {bluebird|exports|module.exports}
 */
function keyEncrypt(item, key) {
    // Return a Promise right away
    return new Promise(function (resolve, reject) {

        // Make sure we're encrypting a string
        item = stringify(item);

        // If the keys already have key objects use them
        if(key.keystore) {

            jose.JWK.asKeyStore(key.keystore).
            then(function(keystore) {

                var input = new Buffer(item);

                var keyObj = keystore.all({use: 'enc'});

                jose.JWE.createEncrypt(keyObj).update(input).final().then(function (result) {
                    resolve({
                        alias: key.alias,
                        crypted: result
                    });
                });
            });
        }

        // Create a JOSE key object from the JSON key provided
        jose.JWK.asKeyStore(key).
        then(function(keystore) {

            var keyObj =  keystore.all({ use: 'enc' });

            var input = new Buffer(item);

            jose.JWE.createEncrypt(keyObj).
            update(input).
            final().
            then(function(result) {
                resolve({
                    alias: key.alias,
                    crypted: result
                });
            });
        });
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



