$( document ).ready(function() {
    console.log( "document loaded" );
    $(".button-collapse").sideNav();
    loadNewDemoKey();
    loadNewSecret();
    getFullDeck();
    decryptFullDeck();
});

var fulldeck;
var secret;
var decrypted;
var key;

function loadNewDemoKey() {
    key = arCrypt.getKey();

    var publicKey = arCrypt.eccrypto.getPublic(key);

    $("#p1Key").val(arCrypt.bytesToHex(key));
    $("#p1PublicKey").val(publicKey.toString('hex'));
}

function loadNewSecret() {
    secret = arCrypt.getSecret();
    $("#sharedSecret").val(arCrypt.bytesToHex(secret));

}

function getShuffledDeck() {
    $.getJSON( "http://localhost:3000/api/demo/deck/shuffled", function( data ) {
        $("#demoShuffledDeck").html('<pre>'+JSON.stringify(data, null, 2)+'</pre>');
    });
}

function getEncryptedDeck() {
    var keys = [{
        alias: "player1",
        public: $("#p1PublicKey").val()
    }];

    $.post('http://localhost:3000/api/demo/deck/encrypted', JSON.stringify(keys), function(data) {
        $("#demoEncryptedDeck").html('<pre>'+JSON.stringify(data, null, 2)+'</pre>');
    }, 'json');
}

function getSplitEncryptedDeck() {
    var keys = [{
        alias: "player1",
        public: $("#p1PublicKey").val()
    }];

    $.post('http://localhost:3000/api/demo/deck/encrypt-combined', JSON.stringify(keys), function(data) {
        $("#demoSplitEncryptedDeck").html('<pre>'+JSON.stringify(data, null, 2)+'</pre>');
    }, 'json');
}

function getFullDeck() {
    var input = {
        keys: [
            {
                alias: "player1",
                public: $("#p1PublicKey").val()
            }
        ],
        secret: $("#sharedSecret").val()
    };

    $.post('http://localhost:3000/api/demo/deck', JSON.stringify(input), function(responseData) {
        fulldeck = responseData;
        $("#demoFullDeck").html('<pre>'+JSON.stringify(responseData, null, 2)+'</pre>');
    }, 'json');
}

function decryptFullDeck() {

    var encrypted = fulldeck;

    var secret = $("#sharedSecret").val();
    var sharedSecret = arCrypt.hexToBuffer(secret);

    var iv = arCrypt.base64ToBuffer(fulldeck.iv);

    var data = arCrypt.base64ToBuffer(encrypted.crypted);

    arCrypt.generateKey(sharedSecret).
    then(function(key){
        return window.crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv }
            , key
            , data
        ).then(function (decryptedData) {

            decrypted = JSON.parse(arCrypt.bufferToUtf8(new Uint8Array(decryptedData)));

            $("#decryptedFullDeck").html('<pre>'+JSON.stringify(decrypted, null, 2)+'</pre>');
        });
    });
}

function decryptSecrets() {

    var secrets = decrypted.secrets;
    playerSecrets = _.find(secrets, ['alias', 'player1']);

    var array = new Uint8Array(32);
    var privateKey = window.crypto.getRandomValues(array);

    var bufferObj =  {
        "ciphertext": arCrypt.hexToBuffer("d953cdc5422f4d7904597d086dafad8d1339d36b0904dba1c0f6ebe2f998976a4faef5b7768a48c4890b2486f68c3fc3c3b42bfae56c76ef5d7bb2e5849039f24f0f1676322ed7ac00c492b343cdcb630ff6755e86774abf11a861a1c87f065dff24145f2377bdd3a04bc103dcb32ea7a473703616f2e5e443ccb8e606958d6a232717144fedabddcc7b936790ee3b033785412195007ef38090d21d963f11373d811124fcdd5a558e811e3abb2da97dab8427dfb7107b19df00ead565a14a03b27712bc3e39d5c39f47a426d9ad180f6df8847086f95f9854d3379281b08ca7ecf74dc60d1fa90d3b8c8a823b592e73e35a1eb4d561b0ded59eb1067168bd9929a502eae6c3e507972584e15dc887ceeb78d8abf84e49c5c8e0e42a4947f848361d6e723a011b2f99b93af5a60b3b936885e42f58bde83c0f274192dd5d3152ad4f270912bb1ef50a3b79837cc611c7b53a788e3b56f73dd1bd52958a9d49c347e67aaa256ea1502ac800855aac16e6b2ea59196356507a19a16b8430830bf8caf2b7804fca862fdba55ec2612a4c076a404e043403208e1e48cdbe2f79b2b6257db2a482cb312ae36f50f2f3b1e95db2f418add85a3e9c04449f508f3362e8"),
        "ephemPublicKey": arCrypt.hexToBuffer("04c272254d96adb83e11a9d2fb331f8e40ef95ceb4edf1505d3b16a5adb434d22ca3c2b18e5cab915164ccba2778673617eb9d04f413965e60347515b6026b30bb"),
        "iv": arCrypt.hexToBuffer("aea2b959b340f34a254033e92346cb82"),
        "mac": arCrypt.hexToBuffer("dd6f5c1ff2dd16c0f999a9cb5bb88f5659a94d9864dda091da27d95c5e968ab2")
    };

    arCrypt.eccrypto.decrypt(privateKey, bufferObj).then(function(plaintext) {
        console.log("secrets", plaintext.toString());
        return plaintext;
    });
}

function dealCard() {


}

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

function randomBytes(size) {
    var arr = new Uint8Array(size);
    global.crypto.getRandomValues(arr);
    return new Buffer(arr);
}

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
        assert(Buffer.isBuffer(privateKeyA), "Bad input");
        assert(Buffer.isBuffer(publicKeyB), "Bad input");
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
            mac: mac,
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


