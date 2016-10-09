/**
 * ActiveRules API localization
 * Provides localized content with fallback options.
 * @TODO create better fallback to root language
 */
const Promise = require("bluebird");

// ============================================================
// Define the Object
// ============================================================

// The function we will export an an object
function arLx(localeRoot) {}

// Return data specific to a page
arLx.prototype.loadAppage = loadAppage;
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
function loadAppage(pageName, locale, site) {

  //  return new Promise(function (resolve, reject) {
        locale = locale || 'default';
        let pageData;

        try{
            pageData = require('../config/localization/page/'+pageName+'/'+locale);
        }
        catch(err){

            // Swallow error and attempt to load default.
            try{
                pageData = require('../config/localization/page/'+pageName+'/default');
            }
            catch(err){
                pageData = {}
            }
        }
    return pageData;

  //      resolve(pageData);
  //  })

}


/**
 * Load localizations meant to be shared across the site
 *
 * @param locale
 * @returns {*}
 */
function loadShared(locale, site) {

    locale = locale || 'default';
    let pageData;

    try{
        pageData = require('../config/localization/shared/'+locale);
    }
    catch(err){
        // Swallow error and attempt to load default.
        pageData = require('../config/localization/shared/default');
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
function loadComponent(componentName, locale, site) {

    locale = locale || 'default';
    let pageData;

    try{
        pageData = require('../config/localization/comp/'+componentName+'/'+locale);
    }
    catch(err){
        // Swallow error and attempt to load default.
        pageData = require('../config/localization/comp/'+componentName+'/default');
    }
    return pageData;
}
