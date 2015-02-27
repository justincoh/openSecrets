var express = require('express');
var router = express.Router();
var models = require('../models');
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;

router.get('/', function(req, res) {
	//Hardcoded for testing, need to pass in through query string
	models.Industry.heatmap('Lobbyists').then(function(docs){

	console.log('heatMaps.js ',docs)
	res.status(200).send();
	})
});

module.exports = router;