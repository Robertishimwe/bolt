const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const createRedisClient = require('../config/redis');
const logger = require('../utils/logger');

const createRateLimiter = async () => {
  try {
    const redisClient = await createRedisClient();

    return rateLimit({
      store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args)
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
  } catch (error) {
    logger.error(error, 'Failed to create Redis rate limiter, falling back to memory store');
    
    // Fallback to memory store if Redis is unavailable
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
  }
};

module.exports = { createRateLimiter };