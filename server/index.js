var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');

const Profile = require('../database-mongo/index').Profile;
const db = require('../database-mongo/index').db;


var geniusToken = process.env.GENIUS_TOKEN;
var spotifyClient = process.env.SPOTIFY_CLIENT;
var spotifySecret = process.env.SPOTIFY_SECRET;
var ibmKey = process.env.IBM_KEY;

var Genius = require('genius-api');
var cheerio = require('cheerio');
var axios = require('axios');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const genius = new Genius(geniusToken);
let spotifyToken;
let id;

const personalityInsights = new PersonalityInsightsV3({
  'version_date': '2017-10-13',
	iam_apikey: ibmKey,
	url: "https://gateway-wdc.watsonplatform.net/personality-insights/api"
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: spotifyClient,
      clientSecret: spotifySecret,
      callbackURL: 'http://localhost:3000/auth/spotify/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
			spotifyToken = accessToken;
			id = profile.id;
			return done(null, profile);
    }
  )
);

var app = express();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'traderjoes',
  resave: true,
	saveUninitialized: false,
	store: new RedisStore()
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/auth/spotify', passport.authenticate('spotify', {
	scope: ['user-top-read'],
	showDialog: true
}));

app.get('/auth/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/lyrics', function(req, res) {
	let donezo = false;
	db.collection('profiles').find({id: id}).toArray((err, profile) => {
		if (err) return console.log(err)
		console.log(profile);
		if (profile.length > 0) {
			profile = profile[0];
			res.status(200).send([JSON.parse(profile.personality), JSON.parse(profile.songs), JSON.parse(profile.values)]);
			donezo = true;
		}
		if (!donezo) {
			var songs;
			const instance = axios.create({
				headers: {'Authorization': 'Bearer ' + spotifyToken}
			});	
			instance.get("https://api.spotify.com/v1/me/top/tracks")
				.then((result) => result.data.items)
				.then((items) => {
					songs = items;
					var helper = (item) => {
						var artist = item.artists[0].name;
						var title = item.name;
						return genius.search(`${artist} ${title}`)
						.then((data) => {
							if (data.hits[0]){
								if (data.hits[0].result.full_title.indexOf(title) > -1 || data.hits[0].result.full_title.indexOf(artist) > -1) return data.hits[0].result.url;
							} 
						})
					}
					const promises = items.map(item => helper(item));
					Promise.all(promises).then((values) => {
						var helper2 = (url) => {
							return axios.get(url)
							.then((html) => {
								var $ = cheerio.load(html.data);
								var lyric = $('.lyrics').text();
								return lyric;
							})
						}
						values = values.filter(url => url);
						const promises2 = values.map(url => helper2(url));
						Promise.all(promises2).then((result) => {
							var text = result.join('');
							var profileParams = {
								content: text,
								'content_type': 'text/plain',
								'consumption_preferences': true,
								'raw_scores': true
							};
							personalityInsights.profile(profileParams, function(error, profile) {
								if (error) {
									console.log(error);
								} else {
									var personality = JSON.parse(JSON.stringify(profile, null, 2));
									Profile.findOneAndUpdate(
										{id: id}, 
										{$set: {
											personality: JSON.stringify(personality), 
											songs: JSON.stringify(songs), 
											values: JSON.stringify(values)
										}},
										{upsert: true}
										).then(res.status(200).send([personality, songs, values]));
								}
							});
						});
					});
				}
			)		
		}
	})
	}			
)

app.listen(process.env.PORT || 3000, function() {
  console.log('listening on port 3000!');
});