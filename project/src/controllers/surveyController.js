const Survey = require('../models/survey');
const { ApiError } = require('../utils/apiError');
const logger = require('../utils/logger');

class SurveyController {
  static async createSurvey(req, res, next) {
    try {
      const { title, description, questions } = req.body;
      const userId = req.user.id;

      const survey = new Survey({
        title,
        description,
        userId,
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1
        }))
      });

      await survey.save();

      res.status(201).json({
        message: 'Survey created successfully',
        survey
      });
    } catch (error) {
      logger.error(error, 'Survey creation failed');
      next(error);
    }
  }

  static async getSurvey(req, res, next) {
    try {
      const { id } = req.params;
      const survey = await Survey.findById(id);

      if (!survey) {
        throw new ApiError(404, 'Survey not found');
      }

      // Check if user owns the survey
      if (survey.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      res.json(survey);
    } catch (error) {
      logger.error(error, 'Failed to fetch survey');
      next(error);
    }
  }

  static async getUserSurveys(req, res, next) {
    try {
      const surveys = await Survey.find({ userId: req.user.id })
        .select('-responses') // Exclude responses for list view
        .sort('-createdAt');

      res.json(surveys);
    } catch (error) {
      logger.error(error, 'Failed to fetch user surveys');
      next(error);
    }
  }

  static async submitResponse(req, res, next) {
    try {
      const { id } = req.params;
      const { email, answers } = req.body;

      const survey = await Survey.findById(id);
      if (!survey) {
        throw new ApiError(404, 'Survey not found');
      }

      survey.responses.push({
        respondentEmail: email,
        answers: new Map(Object.entries(answers))
      });

      await survey.save();

      res.status(201).json({
        message: 'Response submitted successfully'
      });
    } catch (error) {
      logger.error(error, 'Failed to submit response');
      next(error);
    }
  }
}

module.exports = SurveyController;