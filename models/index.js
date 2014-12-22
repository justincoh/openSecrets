var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/openSecrets');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
var findOrCreate = require('mongoose-findorcreate');

var Legislator, Industry;
var Schema = mongoose.Schema;


var legislatorSchema = new Schema({
	state: String,
	firstLast: String,
	lastName: String,
	cId: String,
	party: String,
	dob: String,
	
});

legislatorSchema.plugin(findOrCreate);


var industrySchema = new Schema({
	cId: String,
	industryCode: String,
	industryName: String,
	indivs: Number,
	pacs: Number,
	total: Number
})

industrySchema.plugin(findOrCreate);





Legislator = mongoose.model('Legislator',legislatorSchema);
Industry = mongoose.model('Industry',industrySchema);

module.exports = {"Legislator": Legislator, "Industry":Industry};
