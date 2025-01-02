const Redis = require('redis');
const { promisify } = require('util');
const logger = require('./logger');

class Queue {
  static async initialize() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL
    });

    this.client.on('error', (err) => logger.error(err, 'Redis Queue Error'));
    await this.client.connect();
  }

  static async add(queue, data) {
    try {
      await this.client.lPush(queue, JSON.stringify(data));
      logger.info({ queue }, 'Job added to queue');
    } catch (error) {
      logger.error(error, 'Failed to add job to queue');
      throw error;
    }
  }

  static async process(queue, processor) {
    while (true) {
      try {
        const data = await this.client.bRPop(queue, 0);
        if (data) {
          const job = JSON.parse(data[1]);
          await processor(job);
        }
      } catch (error) {
        logger.error(error, 'Queue processing error');
      }
    }
  }
}

module.exports = Queue;