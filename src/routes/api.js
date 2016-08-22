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


// Export the defined router
module.exports = router;


// ============================================================
// Define route handlers
// ============================================================

function *newShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var data = this.request.body;
            result = yield FullDeck.newShoe(data);
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

function *shuffledShoe(next) {
    if (this.request.method == 'POST') {
        let result;
        try{
            var data = this.request.body;
            result = yield FullDeck.shuffledShoe(data);
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
            var data = this.request.body;
            result = yield FullDeck.indexedShoe(data);
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
            var data = this.request.body;
            result = yield FullDeck.encryptedShoe(data);
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
            var data = this.request.body;
            result = yield FullDeck.splitEncryptedShoe(data);
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
            var data = this.request.body;
            result = yield FullDeck.splitShoeSecrets(data);
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
            var data = this.request.body;
            result = yield FullDeck.combineSplitShoeSecrets(data);
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
            var data = this.request.body;
            result = yield FullDeck.encryptCombineSplitShoeSecrets(data);
            delete result.keys;
            this.body=result;
        }
        catch(err){
            this.throw(err);
        }
    }
}
