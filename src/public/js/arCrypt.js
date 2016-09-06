/**
 * ActiveRules Crypt library
 * Really just a convenience wrapper to other libs
 *
 * @type {*|exports|module.exports}
 */
var eccrypto = require('eccrypto');
var ec = new EC('secp256k1');

exports.eccrypto = eccrypto;

exports.getKey = getKey;

function getKey() {
    var array = new Uint32Array(32);
    var privateKey = window.crypto.getRandomValues(array);
    var publicKey = eccrypto.getPublic(privateKey);
    var key = {
        private: privateKey,
        public: publicKey.toString('hex')
    }
    return privateKey;
}