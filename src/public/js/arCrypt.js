/**
 * ActiveRules Crypt library
 * Really just a convenience wrapper to other libs
 *
 * @type {*|exports|module.exports}
 */
var eccrypto = require('eccrypto');

exports.eccrypto = eccrypto;

exports.getKey = getKey;
exports.bytesToHex = bytesToHex;
exports.hexToBytes = hexToBytes;
exports.getSecret = getSecret;
exports.generateKey = generateKey;

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

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

/**
 * Get a random private key
 * @returns {*}
 */
function getKey() {
    var array = new Uint8Array(32);
    var privateKey = window.crypto.getRandomValues(array);
    return privateKey;
}

/**
 * Get a new random secret
 * @returns {*}
 */
function getSecret() {
    var array = new Uint8Array(16);
    var privateKey = window.crypto.getRandomValues(array);
    return privateKey;
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

