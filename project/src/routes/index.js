const express = require('express');
const authRoutes = require('./auth');
const surveyRoutes = require('./survey');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/surveys', surveyRoutes);

module.exports = router;