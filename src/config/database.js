const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://robertishimwe:murukarifb@cluster0.rhbhy.mongodb.net/surveyProt?retryWrites=true&w=majority");
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;