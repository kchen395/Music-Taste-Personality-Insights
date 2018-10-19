var express = require('express');
var bodyParser = require('body-parser');
var Genius = require('genius-api');
var geniusToken = require('../config.js').GENIUS_TOKEN;
var spotifyClient = require('../config.js').SPOTIFY_CLIENT;
var cheerio = require('cheerio');
var axios = require('axios');

const genius = new Genius(geniusToken);


var app = express();
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());

app.post('/lyrics', function(req, res) {
	let title; 
	genius.search(`${req.body.artist} ${req.body.title}`)
		.then((data) => {
			title = data.hits[0].result.full_title;
			return data.hits[0].result.url
		})
		.then((url) => axios.get(url)
			.then((html) => {
				const $ = cheerio.load(html.data);
				// pd.call({
				// 	path: "emotion"
				// 	, text: $('.lyrics').text()
				// 	}, (err, response) => {
				// 		res.send({
				// 			lyrics: $('.lyrics').text(),
				// 			title: title,
				// 			emotion: response.body.emotion.emotion
				// 		});
				// 	}
				// )
			}));
})


	

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
