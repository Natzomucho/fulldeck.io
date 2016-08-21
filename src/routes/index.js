/**
 * ActiveRules Router.
 * This file will change as routes change.
 */
'use strict'

// Convenience functions
const _ = require('lodash');

/**
 * Use Koa-Router for advanced routing, even though we keep ours pretty simple.
 */
const router = require('koa-router')();

/**
 * Load the Route files
 * These map routes to controller methods.
 */
const web = require(__dirname + '/web');
const api = require(__dirname + '/api');

/**
 * Add the routes to Koa-Router
 */
router.use(web.routes(), web.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

const routes = router.routes();

/**
 * Print out the routes
 */
console.log('** Routed Endpoints **');
_.forEach(routes.router.stack, function(value) {
    _.forEach(value.methods, function(method) {
        if(method != 'HEAD') {
            console.log(method + "\t" + value.path);
        }
    });
});

/**
 * Export the routes to be consumed by Koa
 */
module.exports = routes;
