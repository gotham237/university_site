const express = require('express');

const router = express.Router();

const viewsController = require('../controllers/viewsController');

router.get('/subjects', viewsController.getSubjects);
router.get('/subjects/:slug', viewsController.loadSubject);

module.exports = router;