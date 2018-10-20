var mongoose = require('mongoose');
var mongoURL = process.env.MONGO || "mongodb://kai:kai123@ds137483.mlab.com:37483/lyrics-app";

mongoose.connect(mongoURL, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var profileSchema = mongoose.Schema({
	id: String,
	personality: String,
	songs: String,
	values: String
});

var Profile = mongoose.model('Profile', profileSchema, 'profiles');



module.exports.Profile = Profile;
module.exports.db = db;