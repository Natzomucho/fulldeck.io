/**
 * ActiveRules Crypt library
 * Really just a convenience wrapper to other libs
 *
 * @type {*|exports|module.exports}
 */
var eccrypto = require('eccrypto');
//var ec = new EC('secp256k1');

exports.eccrypto = eccrypto;

exports.getKey = getKey;

function getKey() {
    var array = new Uint8Array(32);
    var privateKey = window.crypto.getRandomValues(array);
    /*
    var publicKey = eccrypto.getPublic(privateKey);
    var key = {
        private: privateKey,
        public: publicKey.toString('hex')
    }
    */
    return privateKey;
}

/**
 * Convert a byte array to a hex string
 * Used to convert a raw EC private key to a hex string.
 * Make sure your private keys are derived from
 * @param bytes
 * @returns {string}
 */
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}