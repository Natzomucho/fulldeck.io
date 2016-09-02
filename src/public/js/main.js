var eccrypto = require('eccrypto');
// var crypto = require('crypto');
exports.eccrypto = eccrypto;

exports.getKey = getKey;


function getKey() {
    var array = new Uint32Array(32);
    var privateKey = window.crypto.getRandomValues(array);
    var publicKey = eccrypto.getPublic(privateKey);
    return {
        private: privateKey,
        public: publicKey.toString('hex')
    }
}