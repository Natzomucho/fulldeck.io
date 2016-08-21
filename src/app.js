'use strict'

const koa = require('koa');
//const router = require('koa-router')();
const logger = require('koa-logger');
const json = require('koa-json-body');
const onerror = require('koa-onerror');
const send = require('koa-send');

const app = koa();

var logOpts = {
    name: "ActiveRules", // log name
    logRequest: true, // log request
    logResponse: true, // log response
    logError: true // log error
};

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

/**
 * Provide HTML Views for the App using doT.js
 * @type {*|exports|module.exports}
 */
const dot = require('koa-dot');
app.use(dot({
        // other options supported by doT.process can be passed here
        path: [__dirname + '/views', __dirname +'/views/partials'],
        // or path: ['./views', './shared'],
        // .dot template names across all folders should be unique,
        // .def files are used only from the current folder (names can repeat across folders)
        // layout: false, // false by default, can be layout view name
        // body: 'body', // 'body' is default, only used with layout
        // interpolation: { start: '<%', end: '%>' } // allows to replace '{{' and '}}'
    })
);

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
