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
router.get('/component/:type/:name', getComponent);
router.get('/appage/:name', getAppage);

module.exports = router;

/**
 * Define the handlers views
 */

function *getAppage() {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        responseData.layout = 'htmlImport';
        console.log('HMMMM!!!  component/appage/' + this.params.name);
        yield this.render('component/appage/account', responseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *getComponent() {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        responseData.layout = 'htmlImport';
        console.log('WTF!!!  component/' + this.params.type + '/' + this.params.name);
        yield this.render('component/' + this.params.type + '/' + this.params.name, responseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *appChrome(next) {
    try{
        var locale = this.getLocaleFromQuery();
        pageData = {};
        var hostname = this.request.hostname;
        pageData.site = ar.site.getSiteData(hostname, rootDir);
        pageData.layout = 'htmlImport';
        yield this.render('component/chrome/default', pageData);
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
        pageData.layout = 'htmlImport';
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