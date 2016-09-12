/**
 * Browser eccrypto implementation.
 */

"use strict";

var EC = require("elliptic").ec;

var ec = new EC("secp256k1");
var cryptoObj = global.crypto || global.msCrypto || {};
var subtle = cryptoObj.subtle || cryptoObj.webkitSubtle;

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function generateKey(rawKey) {
    var usages = ['encrypt', 'decrypt'];
    var extractable = false;

    return window.crypto.subtle.importKey(
        'raw'
        , rawKey
        , { name: 'AES-CBC' }
        , extractable
        , usages
    );
}
exports.generateKey = generateKey;

function newKey() {
    return randomBytes(32);
}
exports.newKey = newKey;

function newSecret() {
    return randomBytes(16);
}
exports.newSecret = newSecret;

function randomBytes(size) {
    var arr = new Uint8Array(size);
    global.crypto.getRandomValues(arr);
    return new Buffer(arr);
}

exports.randomBytes = randomBytes;

function sha512(msg) {
    return subtle.digest({name: "SHA-512"}, msg).then(function(hash) {
        return new Buffer(new Uint8Array(hash));
    });
}

function getAes(op) {
    return function(iv, key, data) {
        var importAlgorithm = {name: "AES-CBC"};
        var keyp = subtle.importKey("raw", key, importAlgorithm, false, [op]);
        return keyp.then(function(cryptoKey) {
            var encAlgorithm = {name: "AES-CBC", iv: iv};
            return subtle[op](encAlgorithm, cryptoKey, data);
        }).then(function(result) {
            return new Buffer(new Uint8Array(result));
        });
    };
}

var aesCbcEncrypt = getAes("encrypt");
var aesCbcDecrypt = getAes("decrypt");

function hmacSha256Sign(key, msg) {
    var algorithm = {name: "HMAC", hash: {name: "SHA-256"}};
    var keyp = subtle.importKey("raw", key, algorithm, false, ["sign"]);
    return keyp.then(function(cryptoKey) {
        return subtle.sign(algorithm, cryptoKey, msg);
    }).then(function(sig) {
        return new Buffer(new Uint8Array(sig));
    });
}

function hmacSha256Verify(key, msg, sig) {
    var algorithm = {name: "HMAC", hash: {name: "SHA-256"}};
    var keyp = subtle.importKey("raw", key, algorithm, false, ["verify"]);
    return keyp.then(function(cryptoKey) {
        return subtle.verify(algorithm, cryptoKey, sig, msg);
    });
}

var getPublic = exports.getPublic = function(privateKey) {
    // This function has sync API so we throw an error immediately.
    assert(privateKey.length === 32, "Bad private key");
    // XXX(Kagami): `elliptic.utils.encode` returns array for every
    // encoding except `hex`.
    return new Buffer(ec.keyFromPrivate(privateKey).getPublic("arr"));
};

function utf8ToBinaryString(str) {
    var escstr = encodeURIComponent(str);
    // replaces any uri escape sequence, such as %0A,
    // with binary escape, such as 0x0A
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    });

    return binstr;
}

function utf8ToBuffer(str) {
    var binstr = utf8ToBinaryString(str);
    var buf = binaryStringToBuffer(binstr);
    return buf;
}

function utf8ToBase64(str) {
    var binstr = utf8ToBinaryString(str);
    return btoa(binstr);
}

function binaryStringToUtf8(binstr) {
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });

    return decodeURIComponent(escstr);
}

function bufferToUtf8(buf) {
    var binstr = bufferToBinaryString(buf);

    return binaryStringToUtf8(binstr);
}

function base64ToUtf8(b64) {
    var binstr = atob(b64);

    return binaryStringToUtf8(binstr);
}

function bufferToBinaryString(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');

    return binstr;
}

function bufferToBase64(arr) {
    var binstr = bufferToBinaryString(arr);
    return btoa(binstr);
}

function binaryStringToBuffer(binstr) {
    var buf;

    if ('undefined' !== typeof Uint8Array) {
        buf = new Uint8Array(binstr.length);
    } else {
        buf = [];
    }

    Array.prototype.forEach.call(binstr, function (ch, i) {
        buf[i] = ch.charCodeAt(0);
    });

    return buf;
}

function base64ToBuffer(base64) {
    var binstr = atob(base64);
    var buf = binaryStringToBuffer(binstr);
    return buf;
}

function bufferToHex(arr) {
    var i;
    var len;
    var hex = '';
    var c;

    for (i = 0, len = arr.length; i < len; i += 1) {
        c = arr[i].toString(16);
        if (c.length < 2) {
            c = '0' + c;
        }
        hex += c;
    }

    return hex;
}

function hexToBuffer(hex) {
    // TODO use Uint8Array or ArrayBuffer or DataView
    var i;
    var byteLen = hex.length / 2;
    var arr;
    var j = 0;

    if (byteLen !== parseInt(byteLen, 10)) {
        throw new Error("Invalid hex length '" + hex.length + "'");
    }

    arr = new Uint8Array(byteLen);

    for (i = 0; i < byteLen; i += 1) {
        arr[i] = parseInt(hex[j] + hex[j + 1], 16);
        j += 2;
    }

    return arr;
}

exports.hexToBuffer = hexToBuffer;
exports.bufferToHex = bufferToHex;

exports.utf8ToBinaryString = utf8ToBinaryString;
exports.utf8ToBuffer = utf8ToBuffer;
exports.utf8ToBase64 = utf8ToBase64;
exports.binaryStringToUtf8 = binaryStringToUtf8;
exports.bufferToUtf8 = bufferToUtf8;
exports.base64ToUtf8 = base64ToUtf8;
exports.bufferToBinaryString = bufferToBinaryString;
exports.bufferToBase64 = bufferToBase64;
exports.binaryStringToBuffer = binaryStringToBuffer;
exports.base64ToBuffer = base64ToBuffer;

// NOTE(Kagami): We don't use promise shim in Browser implementation
// because it's supported natively in new browsers (see
// <http://caniuse.com/#feat=promises>) and we can use only new browsers
// because of the WebCryptoAPI (see
// <http://caniuse.com/#feat=cryptography>).
exports.sign = function(privateKey, msg) {
    return new Promise(function(resolve) {
        assert(privateKey.length === 32, "Bad private key");
        assert(msg.length > 0, "Message should not be empty");
        assert(msg.length <= 32, "Message is too long");
        resolve(new Buffer(ec.sign(msg, privateKey, {canonical: true}).toDER()));
    });
};

exports.verify = function(publicKey, msg, sig) {
    return new Promise(function(resolve, reject) {
        assert(publicKey.length === 65, "Bad public key");
        assert(publicKey[0] === 4, "Bad public key");
        assert(msg.length > 0, "Message should not be empty");
        assert(msg.length <= 32, "Message is too long");
        if (ec.verify(msg, sig, publicKey)) {
            resolve(null);
        } else {
            reject(new Error("Bad signature"));
        }
    });
};

var derive = exports.derive = function(privateKeyA, publicKeyB) {
    return new Promise(function(resolve) {
        assert(Buffer.isBuffer(privateKeyA), "Bad private key input");
        assert(Buffer.isBuffer(publicKeyB), "Bad public key input");
        assert(privateKeyA.length === 32, "Bad private key");
        assert(publicKeyB.length === 65, "Bad public key");
        assert(publicKeyB[0] === 4, "Bad public key");
        var keyA = ec.keyFromPrivate(privateKeyA);
        var keyB = ec.keyFromPublic(publicKeyB);
        var Px = keyA.derive(keyB.getPublic());  // BN instance
        resolve(new Buffer(Px.toArray()));
    });
};

exports.encrypt = function(publicKeyTo, msg, opts) {
    assert(subtle, "WebCryptoAPI is not available");
    opts = opts || {};
    // Tmp variables to save context from flat promises;
    var iv, ephemPublicKey, ciphertext, macKey;
    return new Promise(function(resolve) {
        var ephemPrivateKey = opts.ephemPrivateKey || randomBytes(32);
        ephemPublicKey = getPublic(ephemPrivateKey);
        resolve(derive(ephemPrivateKey, publicKeyTo));
    }).then(function(Px) {
        return sha512(Px);
    }).then(function(hash) {
        iv = opts.iv || randomBytes(16);
        var encryptionKey = hash.slice(0, 32);
        macKey = hash.slice(32);
        return aesCbcEncrypt(iv, encryptionKey, msg);
    }).then(function(data) {
        ciphertext = data;
        var dataToMac = Buffer.concat([iv, ephemPublicKey, ciphertext]);
        return hmacSha256Sign(macKey, dataToMac);
    }).then(function(mac) {
        return {
            iv: iv,
            ephemPublicKey: ephemPublicKey,
            ciphertext: ciphertext,
            mac: mac
        };
    });
};

exports.decrypt = function(privateKey, opts) {
    assert(subtle, "WebCryptoAPI is not available");
    // Tmp variable to save context from flat promises;
    var encryptionKey;
    return derive(privateKey, opts.ephemPublicKey).then(function(Px) {
        return sha512(Px);
    }).then(function(hash) {
        encryptionKey = hash.slice(0, 32);
        var macKey = hash.slice(32);
        var dataToMac = Buffer.concat([
            opts.iv,
            opts.ephemPublicKey,
            opts.ciphertext
        ]);
        return hmacSha256Verify(macKey, dataToMac, opts.mac);
    }).then(function(macGood) {
        assert(macGood, "Bad MAC");
        return aesCbcDecrypt(opts.iv, encryptionKey, opts.ciphertext);
    }).then(function(msg) {
        return new Buffer(new Uint8Array(msg));
    });
};