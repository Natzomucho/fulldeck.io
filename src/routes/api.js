'use strict';

// Koa Router, used to map HTTP verbs to the correct code
const router = require('koa-router')();

// The Fulldeck.io functionality and logic
const APIError = require('../lib/APIError');

// ActiveRules Crypto lib wrapper
const FullDeck = require('../lib/FullDeck');


// ============================================================
// Define Routes for export
// ============================================================

router.get('/keys/new', newKeys); // Get new sign/enc keys
router.get('/keys/public', publicKeys); // Get the Organization public keys
router.post('/decks', newShoe); // Get a signed and encrypted deck of cards

// Demo routes
router.post('/demo/decks/shuffled', shuffledShoe); // Get a deck at the shuffled stage
router.post('/demo/decks/indexed', indexedShoe); // Get a deck at the indexed stage
router.post('/demo/decks/encrypted', encryptedShoe); // Get a deck at the encrypted stage
router.post('/demo/decks/split', splitShoeSecrets); // Get a deck at the split secret stage
router.post('/demo/decks/combined', combineSplitShoeSecrets); // Get a deck at the combined split secret stage
router.post('/demo/decks/encrypt-combined', encryptCombineSplitShoeSecrets); // Get a deck at the combined split secret stage
router.post('/demo/readkey', readKey); // Create a key object from a provided hex key.
router.post('/demo/sign', testSign); // Sign a piece of text and have the sig verified
router.post('/demo/encrypt', testEncrypt); // Sign a piece of text to see if it can be unencrypted
router.post('/demo/decrypt', testDecrypt); // Decrypt encrypted text

router.get('/demo/deck/shuffled', demoShuffledShoe); // Get a deck at the shuffled stage
router.post('/demo/deck/encrypted', demoEncryptedShoe); // Get a deck at the encrypted stage
router.post('/demo/deck/split', demoSplitShoeSecrets); // Get a deck at the split secret stage
router.post('/demo/deck/combined', demoCombineSplitShoeSecrets); // Get a deck after the split secrets have been combined for each player

// Export the defined router
module.exports = router;


// ============================================================
// Define route handlers
// ============================================================

function *newShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.newShoe(input);
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *newKeys(next) {
    if (this.request.method == 'GET') {
        let result;
        try{
            result = yield FullDeck.newKeys();
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *publicKeys(next) {
    if (this.request.method == 'GET') {
        let result;
        try{
            result = yield FullDeck.publicKeys();
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}


// ============================================================
// Demo route handlers
// ============================================================

function *readKey(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.readKey(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *testSign(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.testSign(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *testDecrypt(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.testDecrypt(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *testEncrypt(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.testEncrypt(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *shuffledShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.shuffledShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *demoShuffledShoe(next) {
    if (this.request.method == 'GET') {
        let result, input;
        try{
            input = {
                "keys": [
                ],
                "numDecks": 1,
                "deckDefinition": {
                    "ranks": ["J","Q","K","A"],
                    "suits": ["H"],
                    "jokers": 0
                }
            };
            result = yield FullDeck.shuffledShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *demoEncryptedShoe(next) {
    if (this.request.method == 'POST') {
        let result, input, post;
        try{
            post = this.request.body;
            input = {
                "keys": post,
                "numDecks": 1,
                "deckDefinition": {
                    "ranks": ["J","Q","K","A"],
                    "suits": ["H"],
                    "jokers": 0
                }
            };
            result = yield FullDeck.encryptedShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *indexedShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.indexedShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *encryptedShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.encryptedShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}
function *splitEncryptedShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.splitEncryptedShoe(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *splitShoeSecrets(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.splitShoeSecrets(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *demoSplitShoeSecrets(next) {
    if (this.request.method == 'POST') {
        let result, input, post;
        try{
            post = this.request.body;
            input = {
                "keys": post,
                "numDecks": 1,
                "deckDefinition": {
                    "ranks": ["J","Q","K","A"],
                    "suits": ["H"],
                    "jokers": 0
                }
            };
            result = yield FullDeck.splitShoeSecrets(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *demoCombineSplitShoeSecrets(next) {
    if (this.request.method == 'POST') {
        let result, input, post;
        try{
            post = this.request.body;
            input = {
                "keys": post,
                "numDecks": 1,
                "deckDefinition": {
                    "ranks": ["J","Q","K","A"],
                    "suits": ["H"],
                    "jokers": 0
                }
            };
            result = yield FullDeck.combineSplitShoeSecrets(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}


function *combineSplitShoeSecrets(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.combineSplitShoeSecrets(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}

function *encryptCombineSplitShoeSecrets(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var input = this.request.body;
            result = yield FullDeck.encryptCombineSplitShoeSecrets(input);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}
