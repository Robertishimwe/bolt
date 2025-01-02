const register = require('./registry');
const { configureDefaultMetrics } = require('./defaultMetrics');
const { httpRequestDuration, surveyCreationCounter, activeUsersGauge } = require('./customMetrics');
const metricsMiddleware = require('./middleware');

const setupMetrics = (app) => {
  // Configure default metrics
  configureDefaultMetrics();

  // Apply metrics middleware
  app.use(metricsMiddleware);

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      const metrics = await register.metrics();
      res.send(metrics);
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

module.exports = {
  setupMetrics,
  register,
  httpRequestDuration,
  surveyCreationCounter,
  activeUsersGauge
};