const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    validate
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
    validate
  ],
  AuthController.login
);

module.exports = router;