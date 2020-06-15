var express = require('express');
var projectController = require('../controller/controller');

var router = express.Router();

router.get('/get1', projectController.get1);
router.get('/get2', projectController.get2);

module.exports = router;