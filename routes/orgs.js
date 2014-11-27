var express = require('express');
var router = express.Router();
var http = require('http');
var apiKey = '464d93f237b44d62ce46382d060a193b';
var request = require('request');


//CALL: http://www.opensecrets.org/api/?method=getOrgs&output=json&apikey=464d93f237b44d62ce46382d060a193b&org=Comcast
//Result: {"response":{"organization":{"@attributes":{"orgid":"D000000461","orgname":"Comcast Corp"}}}}


//Using ID from that call, can make this one: http://www.opensecrets.org/api/?method=orgSummary&output=json&apikey=464d93f237b44d62ce46382d060a193b&id=D000000461
//Results in: {"response":{"organization":{"@attributes":{"cycle":"2014","orgid":"D000000461","orgname":"Comcast Corp","total":"4482122","indivs":"1264521","pacs":"3134750","soft":"16401","tot527":"66450","dems":"2316381","repubs":"2100190","lobbying":"18810000","outside":"0","mems_invested":"25","gave_to_pac":"201","gave_to_party":"591110","gave_to_527":"66450","gave_to_cand":"2791461","source":"www.opensecrets.org\/orgs\/summary.php?id=D000000461"}}}}
router.get('/:orgId', function(req, res) {





})




module.exports=router;