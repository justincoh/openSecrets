var express = require('express');
var router = express.Router();
var models = require('../models');
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;

router.get('/?', function(req, res) {
	var industry = Object.keys(req.query)[0];
	//handling '&' characters
	if(industry.indexOf("REPLACED")!==-1){
		industry = industry.replace("REPLACED",'&')
	};
	models.Industry.heatmap(industry).then(function(docs){
		var stateTotals ={};
		docs.forEach(function(entry){
			if(typeof stateTotals[entry.state]==='undefined'){
				stateTotals[entry.state]=entry.total;
			} else {
				stateTotals[entry.state]+=entry.total;
			}
		})
		
		res.json(stateTotals);
	})
});

module.exports = router;