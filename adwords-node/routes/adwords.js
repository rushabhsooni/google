var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
// var parseString = require('xml2js').parseString;
var parseString = require('xml2json');
var excel = require('excel4node');
// var request = require('request');


var authorizationWrapper = 'dummy_value';

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

var downloadCriteriaReportWithAwqlController = require('../controllers/downloadCriteriaReportWithAwqlController')(authorizationWrapper, exec, parseString, excel);
var getReportFieldsController = require('../controllers/getReportFieldsController')(authorizationWrapper, exec);
var getCampaignsController = require('../controllers/getCampaignsController')(authorizationWrapper, exec);

router.post('/DownloadCriteriaReportWithAwql', downloadCriteriaReportWithAwqlController.post)
router.post('/GetReportFields', getReportFieldsController.post)
router.post('/GetCampaigns', getCampaignsController.post)

module.exports = router;
