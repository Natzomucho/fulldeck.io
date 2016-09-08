$( document ).ready(function() {
    console.log( "document loaded" );
    $(".button-collapse").sideNav();
});

function loadNewDemoKey() {
    var key = getKey();

    var publicKey = arCrypt.eccrypto.getPublic(key);

    $("#p1Key").val(arCrypt.bytesToHex(key));
    $("#p1PublicKey").val(publicKey.toString('hex'));

}

function getKey() {
    var array = new Uint8Array(32);
    var privateKey = window.crypto.getRandomValues(array);


    return privateKey;
}

function getShuffledDeck() {
    $.getJSON( "http://localhost:3000/api/demo/deck/shuffled", function( data ) {
        $("#demoShuffledDeck").html('<pre>'+JSON.stringify(data, null, 2)+'</pre>');
    });
}

function getEncryptedDeck() {
    var keys = [{
        public: $("#p1PublicKey").val()
    }];

    $.post('http://localhost:3000/api/demo/deck/encrypted', JSON.stringify(keys), function(data) {
        $("#demoEncryptedDeck").html('<pre>'+JSON.stringify(data, null, 2)+'</pre>');
    }, 'json');
}