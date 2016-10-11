const site = require('./site');

// The function we will export an an object
function ActiveRules(options) {
    if(typeof options != 'object') {
        options = {};
    }
}

// Add properties to the exported functions prototype

// Use the ActiveRules site logic
ActiveRules.prototype.site = site;

// Export the object
module.exports = new ActiveRules();
