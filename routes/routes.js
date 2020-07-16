var express = require('express');
var projectController = require('../controller/controller');

var router = express.Router();

router.post('/addCase', projectController.addCase);
// router.get('/getStadistics', projectController.getStadistics);
router.get('/getInfo', projectController.getInfo);
router.post('/changeInfo', projectController.changeInfo);
router.post('/addAdmin', projectController.addAdmin);


module.exports = router;
