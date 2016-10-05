const router = require('koa-router')();
const path = require('path');

const siteName = 'FullDeck.io';

const ar = require('activerules');

// ActiveRules Crypto lib wrapper
const arLx = require('../lib/arLx');
const lx = new arLx('en_US');

const rootDir = path.resolve(__dirname+'/..');

let pageData = {};

/**
 * Define routes and handlers
 */
router.get('/', homepage);
router.get('/technology', technology);
router.get('/legal', legal);
router.get('/demo', demo);
router.get('/join', join);
router.get('/account', account);
router.get('/view3', view3);
router.get('/page/account', pageAccount);
router.get('/app-chrome', appChrome);

module.exports = router;

/**
 * Define the handlers views
 */

function *appChrome(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData = {};
        var hostname = this.request.hostname;
        pageData.site = ar.site.getSiteData(hostname, rootDir);
        pageData.layout = 'htmlInclude';
        yield this.render('comp/app-chrome', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *view3(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('homepage', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('pages/homepage', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *pageAccount(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('homepage', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('pages/account', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *account(next) {
    try{
        var locale = this.getLocaleFromQuery();
        let pageData = {};
        pageData.site = {};
        pageData.site.name = siteName;
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('homepage', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        pageData.layout = 'htmlInclude';
        yield this.render('pages/account', pageData);
    }
    catch(err){
        this.throw(err);
    }
}

function *homepage(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData = {};
        var hostname = this.request.hostname;
        pageData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(pageData);
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('homepage', locale);
        pageData.nav = lx.loadComponent('nav', locale);
        yield this.render('pages/homepage', pageData);
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