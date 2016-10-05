// The function we will export an an object
function i18n() {}

// Add properties to the exported functions prototype

// Use the ActiveRules site logic
i18n.prototype.t = 'translate';

// Export the object
module.exports = new i18n();
