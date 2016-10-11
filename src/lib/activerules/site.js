// The function we will export an an object
function Site() {}

// Add properties to the exported functions prototype

// Use the ActiveRules site logic
Site.prototype.siteFromHost = siteFromHost;
Site.prototype.getSiteData = getSiteData;

// Export the object
module.exports = new Site();

// Get a site alias from a hostname
function siteFromHost(host) {
    var site = "default";

    host = host.toLowerCase();

    if(host.indexOf("izzup") >=0){
        site = "izzup"
    } else if(host.indexOf("sharedchain") >=0){
        site = "sharedchain"
    } else if(host.indexOf("ultri") >=0){
        site = "ultri"
    } else if(host.indexOf("etownemall") >=0){
        site = "etownemall"
    } else if(host.indexOf("fulldeck") >=0){
        site = "fulldeck"
    } else if(host.indexOf("alertboard") >=0){
        site = "alertboard"
    }

    return site;
}

// Get site data
function getSiteData(host, rootDir) {
    let site, siteData;
    site = siteFromHost(host);
    siteData = require(rootDir + '/config/site/' + site);
    return siteData;
}