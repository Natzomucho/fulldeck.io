const router = require('koa-router')();
const path = require('path');

const siteName = 'FullDeck.io';

const ar = require('activerules');

// ActiveRules Crypto lib wrapper
const arLx = require('../lib/arLx');
const lx = new arLx('en_US');

const rootDir = path.resolve(__dirname+'/..');

let reponseData = {};

/**
 * Define routes and handlers
 */
router.get('/', spa);
router.get('/account', spa);

router.get('/demo2', demo2);

router.get('/demo', demo);

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
        reponseData = {};
        var hostname = this.request.hostname;
        reponseData.site = ar.site.getSiteData(hostname, rootDir);
        reponseData.layout = 'htmlImport';
        yield this.render('component/chrome/default', reponseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *spa(next) {
    try{
        var locale = this.getLocaleFromQuery();
        reponseData = {};
        var hostname = this.request.hostname;
        reponseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(reponseData);
        reponseData.shared = lx.loadShared(locale);
        yield this.render('pages/spa', reponseData);
    }
    catch(err){
        this.throw(err);
    }
}

function *demo2(next) {
    try{
        var locale = this.getLocaleFromQuery();
        reponseData = {};
        var hostname = this.request.hostname;
        reponseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(reponseData);
        reponseData.shared = lx.loadShared(locale);
        reponseData.layout = 'fullpage';
        yield this.render('pages/demo', reponseData);
    }
    catch(err){
        this.throw(err);
    }
}


function *demo(next) {
    try{
        var locale = this.getLocaleFromQuery();
        reponseData = {};
        var hostname = this.request.hostname;
        reponseData.site = ar.site.getSiteData(hostname, rootDir);
        console.log(reponseData);
        reponseData.shared = lx.loadShared(locale);
        reponseData.page = lx.loadPage('demo');
        reponseData.layout = 'html5';
        yield this.render('pages/demo', reponseData);
    }
    catch(err){
        this.throw(err);
    }
}
