const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/loginSignup', viewsController.getLoginSignup);
router.get("/subjects", viewsController.getSubjects);
router.get("/courses", viewsController.getCourses);

module.exports = router;
