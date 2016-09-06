$( document ).ready(function() {
    console.log( "document loaded" );
    $(".button-collapse").sideNav();
});

function loadNewDemoKey() {
    var key = getKey();

    var publicKey = arCrypt.eccrypto.getPublic(key);

    $("#p1Key").val(createHexString(key));
    $("#p1PublicKey").val(publicKey.toString('hex'));

}

function getKey() {
    var array = new Uint8Array(32);
    var privateKey = window.crypto.getRandomValues(array);


    return privateKey;
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
function createHexString(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}