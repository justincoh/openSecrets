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
	var promises = [];
	var stateReps = 'http://www.opensecrets.org/api/?method=getLegislators&cycle=2014&id='+state+'&apikey='+apiKey+'&output=json';
	var responseArray=[];
	request(stateReps,function(err,response){
		var parsedResponse = JSON.parse(response.body).response.legislator;

		parsedResponse.forEach(function(person){
			var thisRep = person['@attributes'];

			var findPromise = models.Legislator.findOne({cid: thisRep.cid},function(err,res){
				if(!res){	//If not found, create
					var createPromise = 
					models.Legislator.create(
						{
				  			state: state,
				  			firstlast: thisRep.firstlast,
				  			lastname: thisRep.lastname,
				  			cid: thisRep.cid,
				  			party: thisRep.party,
				  			dob: thisRep.birthdate
			  			} , 
			  			function(error, createdRep){
			  				// responseArray.push(createdRep)
			  				// if(error) console.log('error ',error)

			  				console.log('ERR',error)
			  				console.log('REsponse',createdRep)
			  			}
			  		);
			  		console.log("createPromise", createPromise)
				promises.push(createPromise)	
				}
			}).exec();

			promises.push(findPromise);

		})

		q.all(promises).then(function(results){
			console.log('PROMISES ',promises)
			console.log('RESULTS ' ,results)
			res.render('state',{
				state:stateAbbrevs[state],
				reps:results}
			)
		})
	})
})

// });


module.exports = router;
