const express = require('express');

const router = express.Router();

const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');

router.get('/', subjectController.getSubjects);
router.get('/:slug', subjectController.loadSubject);
router.post('/apply/:slug', authController.protect, subjectController.apply);

module.exports = router;