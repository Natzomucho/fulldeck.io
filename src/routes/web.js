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
router.get('/security', security);
router.get('/legal', legal);
router.get('/demo', demo);

module.exports = router;

/**
 * Define the handlers views
 */

function *homepage(next) {
    yield this.render('homepage', {
        siteName: siteName,
        title: 'Welcome to FullDeck.io'
    });
}

function *technology(next) {
    yield this.render('technology', {
        siteName: siteName,
        title: 'Technology'
    });
}

function *security(next) {
    yield this.render('security', {
        siteName: siteName,
        title: 'Security'
    });
}

function *legal(next) {
    yield this.render('legal', {
        siteName: 'FullDeck.io',
        title: 'Legal'
    });
}

function *demo(next) {
     try{
        var locale = this.getLocaleFromQuery();
        pageData.shared = lx.loadShared(locale);
        pageData.page = lx.loadPage('demo', locale);
        yield this.render('demo', pageData);
    }
    catch(err){
        this.throw(err);
    }

}