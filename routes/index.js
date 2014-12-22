var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var models = require('../models');

// var pelosiUrl = 'https://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2012&apikey=464d93f237b44d62ce46382d060a193b&output=json';
// var pelosiContributors = 'http://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2012&apikey=464d93f237b44d62ce46382d060a193b&output=json'

var legislators = '/api/?method=getLegislators&id=WY&apikey='+apiKey+'&output=json'

var options = {
  host: 'www.opensecrets.org',
  path: legislators,
  port: 80,  
  method: 'GET'
};


/* GET home page. */
router.get('/', function(req, res) {
	res.render('index')
});

module.exports = router;
