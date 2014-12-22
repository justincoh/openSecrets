var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var models = require('../models');
var stateAbbrevs = require('../public/javascripts/stateAbbrevs.js')

router.get('/:state', function(req, res) {
		
	var state=req.params.state.toUpperCase()
	var stateReps = '/api/?method=getLegislators&cycle=2014&id='+state+'&apikey='+apiKey+'&output=json'
	var options = {
		  host: 'www.opensecrets.org',
		  path: stateReps,
		  port: 80,  
		  method: 'GET'
	};

	var responseArray =[];
	req.on('error', function(e) {
	  	console.log('problem with request: ' + e.message);
	  	res.status(500).send()
  	})
  	var req = http.request(options, function(httpRes) {
		  var buf;
		  httpRes.on('data', function (chunk) {
		    if(!buf){ buf = chunk;}
		    else {buf += chunk}
		  });

		  httpRes.on('end', function() {
			  	var superBuf = JSON.parse(buf);
			  	
			  	var legislators = superBuf.response.legislator  //Legislators is an array of objects
			  	
			  	for(var i=0;i<legislators.length;i++){
			  		var thisRep = superBuf.response.legislator[i]['@attributes'];
			  		// responseArray.push(thisRep)
			  		models.Legislator.findOrCreate(
			  			{
				  			state: state,
				  			firstLast: thisRep.firstlast,
				  			lastName: thisRep.lastname,
				  			cId: thisRep.cid,
				  			party: thisRep.party,
				  			dob: thisRep.birthdate
			  			} ,
			  			function(err,rep,created){
			  				responseArray.push(rep)
			  			}
			  		)	//Legislators have been added to DB
			  	} 		//and pushed to array
			  		console.log('resArray ',responseArray)
			  	

			  	//render is hitting before the findorcreate is done
			  	//need to handle promises
	  			res.render('state', { state: stateAbbrevs[state],
					reps: responseArray}
	  			);
		  		
		  })
	});  //End request

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	  console.log(e)
	});

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end()

	
});


module.exports = router;
