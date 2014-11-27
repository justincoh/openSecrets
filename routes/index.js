var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';

// var pelosiUrl = 'https://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2012&apikey=464d93f237b44d62ce46382d060a193b&output=json';
// var pelosiContributors = 'http://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2012&apikey=464d93f237b44d62ce46382d060a193b&output=json'

var legislators = '/api/?method=getLegislators&id=WY&apikey='+apiKey+'&output=json'

var options = {
  host: 'www.opensecrets.org',
  path: legislators,
  port: 80,  
  method: 'GET'
};

// var WYresponse = '{"response":{"legislator":[{"@attributes":{"cid":"N00029788","firstlast":"Cynthia Marie Lummis","lastname":"LUMMIS","party":"R","office":"WY01","gender":"F","first_elected":"2008","exit_code":"0","comments":"","phone":"202-225-2311","fax":"202-225-3057","website":"http:\/\/lummis.house.gov","webform":"https:\/\/forms.house.gov\/lummis\/contact-form.shtml","congress_office":"113 Cannon House Office Building","bioguide_id":"L000571","votesmart_id":"15546","feccandid":"H8WY00148","twitter_id":"CynthiaLummis","youtube_url":"http:\/\/youtube.com\/CynthiaLummis","facebook_id":"pages\/foo\/152754318103332","birthdate":"1954-09-10"}},{"@attributes":{"cid":"N00006236","firstlast":"John A. Barrasso","lastname":"BARRASSO","party":"R","office":"WYS1","gender":"M","first_elected":"2007","exit_code":"0","comments":"","phone":"202-224-6441","fax":"202-224-1724","website":"http:\/\/www.barrasso.senate.gov","webform":"http:\/\/www.barrasso.senate.gov\/public\/index.cfm?FuseAction=ContactUs.ContactForm","congress_office":"307 Dirksen Senate Office Building","bioguide_id":"B001261","votesmart_id":"52662","feccandid":"S6WY00068","twitter_id":"SenJohnBarrasso","youtube_url":"http:\/\/youtube.com\/barrassowyo","facebook_id":"johnbarrasso","birthdate":"1952-07-21"}},{"@attributes":{"cid":"N00006249","firstlast":"Mike Enzi","lastname":"ENZI","party":"R","office":"WYS2","gender":"M","first_elected":"1996","exit_code":"0","comments":"","phone":"202-224-3424","fax":"202-228-0359","website":"http:\/\/www.enzi.senate.gov","webform":"http:\/\/www.enzi.senate.gov\/public\/index.cfm\/contact?p=e-mail-senator-enzi","congress_office":"379a Russell Senate Office Building","bioguide_id":"E000285","votesmart_id":"558","feccandid":"S6WY00126","twitter_id":"SenatorEnzi","youtube_url":"http:\/\/youtube.com\/senatorenzi","facebook_id":"mikeenzi","birthdate":"1944-02-01"}}]}}';

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index',{title:'Home Page',
				response: 'go to /state/:abbrev'})	
});

module.exports = router;
