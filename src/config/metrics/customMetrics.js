const promClient = require('prom-client');
const register = require('./registry');

// HTTP request duration metric
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

// Survey creation counter
const surveyCreationCounter = new promClient.Counter({
  name: 'survey_creation_total',
  help: 'Total number of surveys created',
  registers: [register]
});

// Active users gauge
const activeUsersGauge = new promClient.Gauge({
  name: 'active_users_count',
  help: 'Number of currently active users',
  registers: [register]
});

module.exports = {
  httpRequestDuration,
  surveyCreationCounter,
  activeUsersGauge
};