const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pinoHttp } = require('pino-http');
const connectDB = require('./config/database');
const { setupMetrics } = require('./config/metrics');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const routes = require('./routes');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(pinoHttp({ logger }));
    app.use(rateLimiter);

    // Setup metrics before routes
    setupMetrics(app);

    // API routes
    app.use('/api/v1', routes);

    // Error handling
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();