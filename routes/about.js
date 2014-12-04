var express = require('express');
var router = express.Router();
var fs = require('fs');



router.get('/', function(req, res) {
	fs.readFile('./about.md',function(err,text){
		if(err){console.log(err)}
		else{ 
			var markdown = text.toString();
			res.render('about',{markdown:markdown})
		}
	})
});

module.exports = router;