const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');
const { activeUsersGauge } = require('../config/metrics');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };

    activeUsersGauge.inc();

    res.on('finish', () => {
      activeUsersGauge.dec();
    });

    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid token'));
  }
};

module.exports = auth;