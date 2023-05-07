const express = require('express');

const router = express.Router();

const viewsController = require('../controllers/viewsController');

router.get('/subjects', viewsController.getSubjects);

module.exports = router;