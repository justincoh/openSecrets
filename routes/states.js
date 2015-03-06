var express = require('express');
var router = express.Router();
var models = require('../models');
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;
var request = require('request');
var q = require('q');


router.get('/:state', function(req, res) {
		
	var state=req.params.state.toUpperCase()
	var legislatorPromiseArray = [];
	var stateReps = 'http://www.opensecrets.org/api/?method=getLegislators&cycle=2014&id='+state+'&apikey='+apiKey+'&output=json';
	var responseArray=[];
	request(stateReps,function(err,response){
		if(response.body==='Resource not found'){
            //handling bad responses from openSecrets
            return res.render('myError',{ 
                response: response.body
            })
        }

		var parsedResponse = JSON.parse(response.body).response.legislator;

		parsedResponse.forEach(function(person){
			var thisRep = person['@attributes'];

			var findPromise = models.Legislator.findOne({cid: thisRep.cid}).exec();
			legislatorPromiseArray.push(findPromise.then(function(res){
				if(res){
					return res;
				} else {
					return models.Legislator.create(
						{
				  			state: state,
				  			firstlast: thisRep.firstlast,
				  			lastname: thisRep.lastname,
				  			cid: thisRep.cid,
				  			party: thisRep.party,
				  			dob: thisRep.birthdate
			  			}  	
		  			)
				}
				console.log('RES  ',res)
			},
				function(err){
					console.log('ERROR ',err)
				}
			))
		})

		var alphabetize = function(a,b){
			if(a.lastname < b.lastname){return -1};
			if(a.lastname > b.lastname){return 1};
		}

		q.all(legislatorPromiseArray).then(function(results){
			res.render('state',{
				state:stateAbbrevs[state],
				reps:results.sort(alphabetize)}
			)
		})
	})
})




module.exports = router;
