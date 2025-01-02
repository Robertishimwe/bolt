const Redis = require('redis');
const logger = require('../utils/logger');

const createRedisClient = async () => {
  const client = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  client.on('error', (err) => logger.error(err, 'Redis Client Error'));
  client.on('connect', () => logger.info('Redis Client Connected'));

  await client.connect();
  return client;
};

module.exports = createRedisClient;