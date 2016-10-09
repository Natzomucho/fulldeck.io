const router = require('koa-router')();
const path = require('path');

const siteName = 'FullDeck.io';

const ar = require('activerules');

// ActiveRules Crypto lib wrapper
const arLx = require('../lib/arLx');
const lx = new arLx('en_US');

const rootDir = path.resolve(__dirname+'/..');

let responseData = {};

/**
 * Define routes and handlers
 */
router.get('/', spa);
router.get('/account', spa);

router.get('/demo2', demo2);

router.get('/demo', demo);

router.get('/page/:name', spa);

router.get('/app-chrome', appChrome);
router.get('/component/:type/:name', getComponent);

module.exports = router;

/**
 * Define the handlers views
 */
function *getComponent() {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        responseData.layout = 'htmlImport';
        yield this.render('component/' + this.params.type + '/' + this.params.name, responseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *appChrome(next) {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        responseData.layout = 'htmlImport';
        yield this.render('component/chrome/default', responseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *spa(next) {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(responseData);
        responseData.shared = lx.loadShared(locale);
        responseData.appage = lx.loadAppage(this.params.name);
        if(this.query.fullpage) {
            responseData.appage.appDrawerLayoutState = "fullbleed force-narrow";
        }
        console.log(responseData);
        yield this.render('pages/spa', responseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *demo2(next) {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(responseData);
        responseData.shared = lx.loadShared(locale);
        responseData.layout = 'fullpage';
        yield this.render('pages/demo', responseData);
    }
    catch(err){
        this.throw(err);
    }
}


function *demo(next) {
    try{
        var locale = this.getLocaleFromQuery();
        responseData = {};
        var hostname = this.request.hostname;
        responseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(responseData);
        responseData.shared = lx.loadShared(locale);
        responseData.page = lx.loadPage('demo');
        if(this.query.fullpage) {
            responseData.appDrawerLayoutState = "fullbleed force-narrow";
        }
        responseData.layout = 'html5';
        yield this.render('pages/demo', responseData);
    }
    catch(err){
        this.throw(err);
    }
}
