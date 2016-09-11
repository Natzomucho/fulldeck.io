$( document ).ready(function() {
    console.log( "document loaded" );
    $(".button-collapse").sideNav();
});

var fulldeck;
var secret;

function loadNewDemoKey() {
    var key = arCrypt.getKey();

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
        ).then(function (decrypted) {

            var text = arCrypt.bufferToUtf8(new Uint8Array(decrypted))

            $("#decryptedFullDeck").html('<pre>'+text+'</pre>');
        });

    });


}


