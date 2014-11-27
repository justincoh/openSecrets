var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';

router.get('/:state', function(req, res) {
	console.log('hit states route')
	var pelosi;
	var state=req.params.state.toUpperCase()
	var stateReps = '/api/?method=getLegislators&id='+state+'&apikey='+apiKey+'&output=json'
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
			  		// console.log(thisRep.firstlast)
			  		responseArray.push(thisRep)
			  		
			  		
			  	} //Responses is filled
			  	
	  			res.render('state', { state: state,
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
