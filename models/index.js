var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/openSecrets');
mongoose.connect(process.env.MONGOLAB_URI)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
var findOrCreate = require('mongoose-findorcreate');

var Legislator, Industry;
var Schema = mongoose.Schema;


var legislatorSchema = new Schema({
	state: String,
	firstlast: String,
	lastname: String,
	cid: String,
	party: String,
	dob: String,
	
});

// legislatorSchema.plugin(findOrCreate);
//doesn't return promises


var industrySchema = new Schema({
	state: String,
	industryCode: String,
	industryName: String,
	indivs: Number,
	pacs: Number,
	total: Number,
	cycle: Number,
	cid: String
})


industrySchema.pre('save',function(next){
	if(!this.isNew){return}
	this.total = this.indivs + this.pacs;
	next();
})

// industrySchema.plugin(findOrCreate);

industrySchema.statics.heatmap = function(industryNameString){
	//Sending promise through to route
	return this.find({industryName: industryNameString}).select('state total').exec();
}



Legislator = mongoose.model('Legislator',legislatorSchema);
Industry = mongoose.model('Industry',industrySchema);

module.exports = {"Legislator": Legislator, "Industry":Industry};
