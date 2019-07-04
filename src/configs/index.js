var env = process.env.REACT_APP_ENV || process.env.NODE_ENV;

var server = require('./server.config');

/**
 * Module exports
 */
module.exports = {
  server: server[env]
}