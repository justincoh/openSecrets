var express = require('express');
var router = express.Router();
var models = require('../models');
var utilities = require('../public/javascripts/utilities.js');
var stateAbbrevs = utilities.states;
var apiKey = utilities.apiKey;
var request = require('request');
var q = require('q');


router.get('/', function(req, res) {
	console.log('Seed Route Hit');
	res.status(200).send();
	}
)


module.exports = router;