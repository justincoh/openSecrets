var express = require('express');
var router = express.Router();
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;
var request = require('request');
var q = require('q');  //how can i refactor this with q?

router.get('/:state/:repId', function(req, res) {
	var repId = req.params.repId;
    var state = req.params.state;
    var cycle = 2014;
    var industrySummary = 'http://www.opensecrets.org/api/?method=candIndustry&cid='+repId+'&cycle='+cycle+'&output=json&apikey='+apiKey;
	// var repCall = 'http://www.opensecrets.org/api/?method=candSummary&cid='+repId+'cycle=2014&apikey='+apiKey+'&output=json';
	
    
    request(industrySummary,function(err,response){
        var parsedResponse = JSON.parse(response.body).response.industries;
        var candidate = parsedResponse['@attributes'];
        var orgs = parsedResponse.industry;
        var industryPromiseArray = [];

        orgs.forEach(function(org){
            
            //need to make database call first to see if they're in there
            var thisOrg = org['@attributes'];

            var promiseForIndustry = models.Industry.findOne({state:state,indivs:thisOrg.indivs,pacs: thisOrg.indivs}).exec()
            industryPromiseArray.push(promiseForIndustry.then(function(res){
                if(res){
                    return res;
                } else {
                    return models.Industry.create(
                        {
                            state:state,
                            industryCode: thisOrg.industryCode,
                            industryName: thisOrg.industry_name,
                            indivs: thisOrg.indivs,
                            pacs: thisOrg.pacs,
                            cycle: cycle

                        }

                        ////Finish refactoring this built off of states.js example

                    )
                }


            })
                



            ////this needs to be done with the returned promise results
            ////instead of just from the api call, for heatmapping purposes
            var totals = {};
            totals.industry = thisOrg.industry_name;
            totals.total = +thisOrg.total;
            pieData.push(totals)

        })

    })



    ////Refactoring above to feed data and use promises
    ////Will be necessary to create main page heatmap
    // request(industrySummary, function (err, response) {
    //     // console.log('REP SUMMARY ROUTE HIT')
    //     var parsedResponse = JSON.parse(response.body).response.industries;
    //     var candidate = parsedResponse['@attributes'];

    //     //This yields IND Attribs  { industry_code: 'K01',
    //                                   // industry_name: 'Lawyers/Law Firms',
    //                                   // indivs: '1244450',
    //                                   // pacs: '166371',
    //                                   // total: '1410821' }
    //     var orgs = parsedResponse.industry; //Array of industry objects
        
    //     console.log('ORGS ',orgs[0]['@attributes'])
        

    //     var pieData =[];
    //     orgs.forEach(function(org){
    //         var thisOrg = org['@attributes'];
    //         var totals ={};
    //         totals.industry = thisOrg.industry_name;
    //         totals.total = +thisOrg.total;
    //         pieData.push(totals)
    //     })
        
    //     // console.log('PIE DATA: ',pieData)
    //     res.render('reps',{
    //         candidate: candidate,
    //         contributors: orgs,
    //         pieData:pieData
    //     })
    // })



	
	
})


module.exports = router;






