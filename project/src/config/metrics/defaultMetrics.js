const promClient = require('prom-client');
const register = require('./registry');

// Configure default metrics with specific settings
const configureDefaultMetrics = () => {
  promClient.collectDefaultMetrics({
    register,
    prefix: 'survey_api_',
    eventLoopMonitoringPrecision: 10,
    // Disable problematic collectors
    config: {
      eventLoopLag: false,
      eventLoopUtilization: false
    }
  });
};

module.exports = { configureDefaultMetrics };