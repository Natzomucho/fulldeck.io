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