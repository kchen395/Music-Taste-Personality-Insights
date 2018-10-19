var mongoose = require('mongoose');
mongoose.connect('mongodb://kai:kai123@ds137283.mlab.com:37283/lyrics-data');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  quantity: Number,
  description: String
});

var Item = mongoose.model('Item', itemSchema);



module.exports.selectAll = selectAll;
