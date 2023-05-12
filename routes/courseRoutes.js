const express = require('express');
const coursesController = require('../controllers/coursesController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', coursesController.getAllCourses);
router.post('/buyCourse/:slug', authController.protect, coursesController.buyCourse);

module.exports = router;