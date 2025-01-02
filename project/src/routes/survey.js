const express = require('express');
const { body } = require('express-validator');
const SurveyController = require('../controllers/surveyController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(auth); // Protect all survey routes

router.post(
  '/',
  [
    body('title').trim().notEmpty(),
    body('questions').isArray({ min: 1 }),
    body('questions.*.text').trim().notEmpty(),
    body('questions.*.type').isIn(['text', 'multiple_choice', 'checkbox']),
    validate
  ],
  SurveyController.createSurvey
);

router.get('/:id', SurveyController.getSurvey);
router.get('/', SurveyController.getUserSurveys);

router.post(
  '/:id/responses',
  [
    body('email').isEmail(),
    body('answers').isObject().notEmpty(),
    validate
  ],
  SurveyController.submitResponse
);

module.exports = router;