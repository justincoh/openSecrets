var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var request = require('request');
// var q = require('q');  //how can i refactor this with q?

router.get('/:repId', function(req, res) {
	// console.log('HIT REP ROUTE')
	var repId = req.params.repId;
	var repCall = 'http://www.opensecrets.org/api/?method=candSummary&cid='+repId+'cycle=2014&apikey='+apiKey+'&output=json';
	var contributors = 'http://www.opensecrets.org/api/?method=candContrib&cid='+repId+'&cycle=2014&output=json&apikey='+apiKey;
	
	request(contributors, function (err, response) {
  		if (err)  console.log('ERROR: ',err);
    	
    	var parsed = JSON.parse(response.body);
    	var contributors = parsed.response.contributors['contributor']; //yields array of contributor objects
    	var candidate = parsed.response.contributors['@attributes'];
    	// console.log('CONTRIBUTORS ',contributors)
    	
    	// console.log('CANDIDATE ',candidate)	//keys cand_name, cid, cycle and others
    	// console.log('Contributors ',Object.keys(contributors[0]['@attributes']))  //Object.keys(contributors[i]['@attributes']) yields [ 'org_name', 'total', 'pacs', 'indivs' ]
    	
    	//This['@attributes'] gives an array of contributor objects with keys: org_name, total, pacs, indivs
	
    	console.log('CAND ',candidate)
    	console.log('contrib ',contributors)

    res.render('reps',{
			candidate:candidate,
			contributors:contributors
			}
    )
    




	})
	
	
})


module.exports = router;