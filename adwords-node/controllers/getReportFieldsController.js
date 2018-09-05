var getReportFieldsController = function (authorizationWrapper, exec) {

  var post = function (req, res, next) {
    if (authorizationWrapper.localeCompare(req.get('authorizationwrapper')) === 0) {

      // var phpCommand = 'php /var/www/html/projects/auburn/adwords-api/googleads-php-lib/examples/AdWords/v201806/Reporting/GetReportFields.php'; //localhost
      var phpCommand = 'php /FTP/stage/projects/auburn/adwords/googleads-php-lib/examples/AdWords/v201806/Reporting/GetReportFields.php'; //live

      exec(phpCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          res.send({
            "code": "400",
            "error": "exec error occured"
          });
        }

        // parsing output string to json
        var getReportFieldsData = JSON.parse(stdout);

        // expected variables
        var manyavarArray = [
          'CampaignId',
          'CampaignName',
          'Clicks',
          'ActiveViewMeasurability',
          'CTR',
          'Cost',
          'AverageCpc',
          'AverageCpm',
          'SearchImpressionShare',
          'CurrentModelAttributedConversions'
        ];

        // _.find(sourceArray, matches with);
        // _.find(getReportFieldsData, ['']);

        var finalRequiredReportFields = [];

        manyavarArray.forEach(manyavar => {
          getReportFieldsData.forEach(reportFields => {

            if (manyavar == reportFields.fieldName) {

              finalRequiredReportFields.push(reportFields);

            }

          });
        });
        res.status(200);
        res.send({
          "code": "200",
          "data": finalRequiredReportFields,
          "message": 'Data fetched successfully'
        });
      });

    } else {
      res.status(400);
      res.send({
        "code": "400",
        "error": "invalid accesstoken-wrapper"
      });
    }
  };


  function exampleFunction() {

  }

  return {
    post: post
  }
}

module.exports = getReportFieldsController;