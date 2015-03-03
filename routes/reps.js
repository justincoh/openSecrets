var express = require('express');
var router = express.Router();
var models = require('../models');
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;
var request = require('request');
var q = require('q');

router.get('/:state/:repId', function(req, res) {
	var repId = req.params.repId;
    var state = req.params.state;
    var cycle = 2014;
    var industrySummary = 'http://www.opensecrets.org/api/?method=candIndustry&cid='+repId+'&cycle='+cycle+'&output=json&apikey='+apiKey;
	
    request(industrySummary,function(err,response){
        if(!response.hasOwnProperty('body')){
            //handling bad responses from openSecrets
            return res.render('myError',{ 
                response: response
            })
        }

        var parsedResponse = JSON.parse(response.body).response.industries;
        var candidate = parsedResponse['@attributes'];
        var orgs = parsedResponse.industry;
        var industryPromiseArray = [];

        orgs.forEach(function(org){
            var thisOrg = org['@attributes'];
            var promiseForIndustry = models.Industry.findOne({state:state,indivs:thisOrg.indivs,pacs: thisOrg.pacs}).exec()
            industryPromiseArray.push(promiseForIndustry.then(function(res){
                if(res){
                    return res;
                } else {
                    return models.Industry.create(
                        {
                            state:state,
                            industryCode: thisOrg.industry_code,
                            industryName: thisOrg.industry_name,
                            indivs: thisOrg.indivs,
                            pacs: thisOrg.pacs,
                            cycle: cycle,
                            cid: repId

                        })
                }
            },
                function(err){
                    console.log('ERROR ',err)
                }
            ))
        })

        q.all(industryPromiseArray).then(function(results){
            var pieData=[];
            results.forEach(function(industry){
                var totals = {};
                totals.industry = industry.industryName;
                totals.total = industry.total
                pieData.push(totals)
            })

            return res.render('reps',{
                candidate: candidate,
                stateAbbrev: state,
                stateName: stateAbbrevs[state],
                contributors: results.industry,
                pieData:pieData
                
            })

        })
    })

})


module.exports = router;






