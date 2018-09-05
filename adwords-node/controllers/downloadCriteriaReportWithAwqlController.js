var downloadCriteriaReportWithAwqlController = function (authorizationWrapper, exec, parseString, excel, request) {

  var post = function (req, res, next) {
    if (authorizationWrapper.localeCompare(req.get('authorizationwrapper')) === 0) {

      var reqCampaigns = req.body.campaigns;
      var reqReportFields = req.body.reportFields;

      var reqReportFieldsArray = [];

      reqReportFields.forEach(reportField => {
        reqReportFieldsArray.push(reportField.fieldName);
      });
      var stringReqReportFields = JSON.stringify(reqReportFieldsArray);

      var dateRange = JSON.stringify(req.body.dateRange);


      // var phpCommand = 'php /var/www/html/projects/auburn/adwords-api/googleads-php-lib/examples/AdWords/v201806/Reporting/DownloadCriteriaReportWithAwql.php '+'\''+ stringReqReportFields +'\' \''+ dateRange+'\''; //localhost
      var phpCommand = 'php /FTP/stage/projects/auburn/adwords/googleads-php-lib/examples/AdWords/v201806/Reporting/DownloadCriteriaReportWithAwql.php '+'\''+ stringReqReportFields +'\' \''+ dateRange+'\''; //live

      exec(phpCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          res.send({
            "code": "400",
            "error": "exec error occured"
          });
        }

        
        var parsedJson = JSON.parse(parseString.toJson(stdout))
        // createWorkBook(parsedJson);
        res.status(200);
        res.send({
          "code": "200",
          "data": parsedJson,
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


  function createWorkBook(parsedJson) {
    // Create a new instance of a Workbook class
    var workbook = new excel.Workbook();

    // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet('Sheet 1');

    // style
    const bgStyle = workbook.createStyle({
      fill: {
        type: 'pattern',
        patternType: 'solid',
        // bgColor: '#FFFF00',
        fgColor: '#FFFF00',
        size: 12
      }
    });


    /* Inserting data in first row i.e heading */
    var HeadingArray = parsedJson.report.table.columns.column;
    var headingCount = 0;
    HeadingArray.forEach(heading => {
      headingCount = headingCount + 1;
      // cell(rows, column);
      worksheet.cell(1, headingCount).string(heading.display).style(bgStyle);
    });

    /* Inserting data in data rows */
    var rowArray = parsedJson.report.table.row;
    var rowCount = 1;
    rowArray.forEach(row => {
      rowCount = rowCount + 1;
      // cell(rows, column);
      worksheet.cell(rowCount, 1).string(row.campaignID);
      worksheet.cell(rowCount, 2).string(row.campaign);
      worksheet.cell(rowCount, 3).string(row.impressions);
      worksheet.cell(rowCount, 4).string(row.clicks);
      worksheet.cell(rowCount, 5).string(row.cost);
      worksheet.cell(rowCount, 6).string(row.costAllConv);
    });





    console.log(new Date().toISOString());
    var dateString = new Date().toISOString();
    workbook.write('excels/Excel' + dateString + '.xlsx');
  }

  return {
    post: post
  }
}

module.exports = downloadCriteriaReportWithAwqlController;