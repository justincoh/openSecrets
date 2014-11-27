var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var request = require('request');
// var q = require('q');  //how can i refactor this with q?

router.get('/:repId', function(req, res) {
	// console.log('HIT REP ROUTE')
	var repId = req.params.repId;
	// var repCall = 'http://www.opensecrets.org/api/?method=candSummary&cid='+repId+'cycle=2014&apikey='+apiKey+'&output=json';
	
	

    //Test this, summarizes contributions by industry
    //Better than getting the specifics below imo
    var industrySummary = 'http://www.opensecrets.org/api/?method=candIndustry&cid='+repId+'&cycle=2014&output=json&apikey='+apiKey;
    request(industrySummary, function (err, response) {
        var parsedResponse = JSON.parse(response.body).response.industries;
        var candidate = parsedResponse['@attributes'];
        // console.log('INDUSTRIES :',parsedResponse)
        //console.log('Candidate: ',parsedResponse['@attributes']['cand_name'])
        
        console.log('IND Attribs ',parsedResponse.industry[0]['@attributes'])  

        //This yields IND Attribs  { industry_code: 'K01',
                                      // industry_name: 'Lawyers/Law Firms',
                                      // indivs: '1244450',
                                      // pacs: '166371',
                                      // total: '1410821' }
        var orgs = parsedResponse.industry; //Array of industry objects
        
        res.render('reps',{
            candidate: candidate,
            contributors: orgs
        })
    })





    //var contributorCall = 'http://www.opensecrets.org/api/?method=candContrib&cid='+repId+'&cycle=2014&output=json&apikey='+apiKey;
	// request(contributorCall, function (err, response) {
 //  		if (err)  console.log('ERROR: ',err);
    	
 //    	var parsed = JSON.parse(response.body);
 //    	var contributors = parsed.response.contributors['contributor']; //yields array of contributor objects
 //    	var candidate = parsed.response.contributors['@attributes'];
 //    	// console.log('CONTRIBUTORS ',contributors)
    	
 //    	// console.log('CANDIDATE ',candidate)	//keys cand_name, cid, cycle and others
 //    	// console.log('Contributors ',Object.keys(contributors[0]['@attributes']))  //Object.keys(contributors[i]['@attributes']) yields [ 'org_name', 'total', 'pacs', 'indivs' ]
    	
 //    	//This['@attributes'] gives an array of contributor objects with keys: org_name, total, pacs, indivs
	
 //    	// console.log('CAND ',candidate)
 //    	console.log('contrib ',contributors)

 //        res.render('reps',{
	// 		candidate:candidate,
	// 		contributors:contributors
	// 		}
 //        )
    
	// })
	
	
})


module.exports = router;