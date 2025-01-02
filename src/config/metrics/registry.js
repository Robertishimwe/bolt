const promClient = require('prom-client');

// Create and export a single registry instance
const register = new promClient.Registry();

module.exports = register;