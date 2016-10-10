'use strict'

const koa = require('koa');
//const router = require('koa-router')();
const logger = require('koa-logger');
const json = require('koa-json-body');
const onerror = require('koa-onerror');
const send = require('koa-send');
const path = require('path');

// Define log options
const logOpts = {
    name: "ActiveRules", // log name
    logRequest: true, // log request
    logResponse: true, // log response
    logError: true // log error
};

/**
 * Create App
 */
const app = koa();

/**
 * Use the logger
 */
app.use(logger(logOpts));

/**
 * Fall through HTTP API Error handler.
 * To use, throw an APIError with status and message from a controller method.
 */
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        var status = err.status || 500;
        this.status = status;
        this.body = err.message || 'Server Error';
        console.log(status + ' ' + err.message);
    }
});

/**
 * Set a limit on the size of the JSON POST and PUT objects
 */
app.use(json({ limit: '2mb' }));


// Get locale variable from query, subdomain, the last domain, accept-languages or cookie for koa
const locale = require('koa-locale');
// the locale key name defaults to `locale`
locale(app, 'locale');


var handlebars = require("koa-handlebars");

var helpers = {};
helpers["nav"] = function(nav) {
    return "nav" + nav;
}

app.use(handlebars({
    defaultLayout: "spa",
    helpers: helpers,
    layoutsDir: "src/views/layouts",
    partialsDir: "src/views/partials",
    viewsDir: "src/views"
}));


/**
 * Add the Koa-Router routes to the App
 */
const routes = require(__dirname + '/routes');
app.use(routes);

/**
 * Route static file paths
 */
app.use(function *(){
    yield send(this, this.path, { root: __dirname + '/public' });
})

/**
 * Handle errors that got this far
 */
app.on('error', function(err, ctx){
    logger.error('server error', err, ctx);
});

/**
 * Export the fully defined app
 */
module.exports = app;
