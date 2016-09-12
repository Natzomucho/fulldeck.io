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
    key = arCrypto.newKey();

    var publicKey = arCrypto.getPublic(key);

    $("#p1Key").val(arCrypto.bufferToHex(key));
    $("#p1PublicKey").val(publicKey.toString('hex'));
}

function loadNewSecret() {
    secret = arCrypto.newSecret();
    $("#sharedSecret").val(arCrypto.bufferToHex(secret));

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
    var sharedSecret = arCrypto.hexToBuffer(secret);

    var iv = arCrypto.base64ToBuffer(fulldeck.iv);

    var data = arCrypto.base64ToBuffer(encrypted.crypted);

    arCrypto.generateKey(sharedSecret).
    then(function(key){
        return window.crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv }
            , key
            , data
        ).then(function (decryptedData) {

            decrypted = JSON.parse(arCrypto.bufferToUtf8(new Uint8Array(decryptedData)));

            $("#decryptedFullDeck").html('<pre>'+JSON.stringify(decrypted, null, 2)+'</pre>');
        });
    });
}

function decryptSecrets() {

    var secrets = decrypted.secrets;
    playerSecrets = _.find(secrets, ['alias', 'player1']);

    //playerSecrets.crypted.ephemPublicKey = hexToBytes(playerSecrets.crypted.ephemPublicKey);
    //playerSecrets.crypted.iv = arCrypto.hexToBuffer(playerSecrets.crypted.iv);
    //playerSecrets.crypted.mac = arCrypto.hexToBuffer(playerSecrets.crypted.mac);

    console.log(playerSecrets.crypted);
    //arCrypto.generateKey(key).
    //then(function(keyObj) {
    //    console.log(keyObj);
        return arCrypto.decrypt(key, playerSecrets.crypted);
    //});
    //console.log(key);
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function dealCard() {


}


