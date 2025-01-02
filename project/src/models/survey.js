const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'multiple_choice', 'checkbox'],
    required: true
  },
  options: {
    type: [String]
  },
  required: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  responses: [{
    respondentEmail: {
      type: String,
      required: true
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
surveySchema.index({ userId: 1 });
surveySchema.index({ 'responses.respondentEmail': 1 });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;