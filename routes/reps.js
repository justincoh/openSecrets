var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var request = require('request');
// var q = require('q');  //how can i refactor this with q?

router.get('/:repId', function(req, res) {
	var repId = req.params.repId;
	// var repCall = 'http://www.opensecrets.org/api/?method=candSummary&cid='+repId+'cycle=2014&apikey='+apiKey+'&output=json';
	
    var industrySummary = 'http://www.opensecrets.org/api/?method=candIndustry&cid='+repId+'&cycle=2014&output=json&apikey='+apiKey;
    request(industrySummary, function (err, response) {
        // console.log('REP SUMMARY ROUTE HIT')
        var parsedResponse = JSON.parse(response.body).response.industries;
        var candidate = parsedResponse['@attributes'];

        //This yields IND Attribs  { industry_code: 'K01',
                                      // industry_name: 'Lawyers/Law Firms',
                                      // indivs: '1244450',
                                      // pacs: '166371',
                                      // total: '1410821' }
        var orgs = parsedResponse.industry; //Array of industry objects
        
        // console.log('ORGS ',orgs[0]['@attributes'])

        var pieData =[];
        orgs.forEach(function(org){
            var thisOrg = org['@attributes'];
            var totals ={};
            totals.industry = thisOrg.industry_name;
            totals.total = +thisOrg.total;
            pieData.push(totals)
        })
        
        // console.log('PIE DATA: ',pieData)
        res.render('reps',{
            candidate: candidate,
            contributors: orgs,
            pieData:pieData
        })
    })



	
	
})


module.exports = router;






