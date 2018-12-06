const mongoose = require("mongoose");
// for development only
// const { MONGO } = require("../config.js");
const mongoURL = process.env.MONGO || MONGO;

mongoose.connect(
  mongoURL,
  { useMongoClient: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const profileSchema = mongoose.Schema({
  id: String,
  personality: String,
  songs: String,
  values: String
});

const Profile = mongoose.model("Profile", profileSchema, "profiles");

module.exports.Profile = Profile;
module.exports.db = db;
