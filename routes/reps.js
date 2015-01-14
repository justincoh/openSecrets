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
                        .then(function(industry){
                            return industry
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
                //Total should probably be a mongoose virtual
                totals.industry = industry.industryName;
                totals.total = +industry.indivs;
                totals.total += +industry.pacs
                pieData.push(totals)
            })

            res.render('reps',{
                candidate: candidate,
                contributors: results.industry,
                pieData:pieData
                
            })

        })
    })

})


module.exports = router;






