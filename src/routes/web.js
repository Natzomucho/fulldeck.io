const router = require('koa-router')();

const siteName = 'FullDeck.io';

// ActiveRules Crypto lib wrapper
const arLx = require('../lib/arLx');
const lx = new arLx('en_US');

// Set some global data
let pageData = {};
pageData.site = {};
pageData.site.name = siteName;


/**
 * Define routes and handlers
 */
router.get('/', homepage);
router.get('/technology', technology);
router.get('/legal', legal);
router.get('/demo', demo);
router.get('/join', join);

module.exports = router;

/**
 * Define the handlers views
 */

function *homepage(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('homepage', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('homepage', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *technology(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('technology', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('technology', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *legal(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('legal', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('legal', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *demo(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('demo', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('demo', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *join(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('join', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('join', pageData);
    }
    catch(err){
        this.throw(err);
    }
}