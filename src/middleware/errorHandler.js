const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = { errorHandler };