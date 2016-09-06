/**
 * ActiveRules API localization
 * Provides localized content with fallback options.
 * @TODO create better fallback to root language
 */

// ============================================================
// Define the Object
// ============================================================

// The function we will export an an object
function arLx(localeRoot) {}

// Return data specific to a page
arLx.prototype.loadPage = loadPage;
// Load data expecetd to be shared across any/all pages. There may be exceptions.
arLx.prototype.loadShared = loadShared;
// Load data expected to be shared across any/all pages. There may be exceptions.
arLx.prototype.loadComponent = loadComponent;

// Export the object
module.exports = arLx;

// ============================================================
// Define the public functions used the object
// ============================================================

/**
 * Load localizations for a page
 * @param pageName
 * @param locale
 * @returns {*}
 */
function loadPage(pageName, locale) {

    locale = locale || 'default';
    let pageData;

    try{
        pageData = require('../public/localization/page/'+pageName+'/'+locale);
    }
    catch(err){
        // Swallow error and attempt to load default.
        pageData = require('../public/localization/page/'+pageName+'/default');
    }

    return pageData;
}


/**
 * Load localizations meant to be shared across the site
 *
 * @param locale
 * @returns {*}
 */
function loadShared(locale) {

    locale = locale || 'default';
    let pageData;

    try{
        pageData = require('../public/localization/shared/'+locale);
    }
    catch(err){
        // Swallow error and attempt to load default.
        pageData = require('../public/localization/shared/default');
    }

    return pageData;
}


/**
 * Load localizations for a component
 *
 * @param componentName
 * @param locale
 * @returns {*}
 */
function loadComponent(componentName, locale) {

    locale = locale || 'default';
    let pageData;

    try{
        pageData = require('../public/localization/comp/'+componentName+'/'+locale);
    }
    catch(err){
        // Swallow error and attempt to load default.
        pageData = require('../public/localization/comp/'+componentName+'/default');
    }
    return pageData;
}
