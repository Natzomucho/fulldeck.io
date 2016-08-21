#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */

const app = require('./app');
const debug = require('debug')('demo:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');

/**
 * Create HTTP server.
 */
const server = http.createServer(app.callback());

/**
 * Include Socket.IO and P2P support
 */
const io = require('socket.io')(server);
const p2pserver = require('socket.io-p2p-server').Server

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Tell socket.io about the P2P server
 */
io.use(p2pserver);

/**
 * Socket.io connection handler
 */
io.on('connection', function(socket) {
  console.log('a user connected');

  // Peer message handler
  socket.on('peer-msg', function(data) {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  })

  // Create Private P2P connection handler
  socket.on('go-private', function(data) {
    socket.broadcast.emit('go-private', data);
  });
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
