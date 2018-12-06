const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const axios = require("axios");
const passport = require("passport");

const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const Profile = require("../database-mongo/index").Profile;
const db = require("../database-mongo/index").db;

const Genius = require("genius-api");
const SpotifyStrategy = require("passport-spotify").Strategy;
const PersonalityInsightsV3 = require("watson-developer-cloud/personality-insights/v3");

//For development only
// const {
//   GENIUS_TOKEN,
//   IBM_KEY,
//   SPOTIFY_CLIENT,
//   SPOTIFY_SECRET
// } = require("../config.js");

const geniusToken = process.env.GENIUS_TOKEN || GENIUS_TOKEN;
const spotifyClient = process.env.SPOTIFY_CLIENT || SPOTIFY_CLIENT;
const spotifySecret = process.env.SPOTIFY_SECRET || SPOTIFY_SECRET;
const ibmKey = process.env.IBM_KEY || IBM_KEY;

const genius = new Genius(geniusToken);

let spotifyToken;
let id;

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
      callbackURL:
        "https://music-taste-personality.herokuapp.com/auth/spotify/callback"
      // for development
      // callbackURL: "http://localhost:3000/auth/spotify/callback"
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      spotifyToken = accessToken;
      id = profile.id;
      return done(null, profile);
    }
  )
);

const personalityInsights = new PersonalityInsightsV3({
  version_date: "2017-10-13",
  iam_apikey: ibmKey,
  url: "https://gateway-wdc.watsonplatform.net/personality-insights/api"
});

const app = express();

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "traderjoes",
    resave: true,
    saveUninitialized: false,
    store: new RedisStore()
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/../react-client/dist"));

app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-top-read"],
    showDialog: true
  })
);

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/");
  }
);

app.get("/lyrics", function(req, res) {
  //checks if id is already in database
  let done = false;
  db.collection("profiles")
    .find({ id: id })
    .toArray((err, profile) => {
      if (err) return console.log(err);
      if (profile.length > 0) {
        profile = profile[0];
        id = null;
        spotifyToken = null;
        //send back to client if it is in cache
        res
          .status(200)
          .send([
            JSON.parse(profile.personality),
            JSON.parse(profile.songs),
            JSON.parse(profile.values)
          ]);
        done = true;
      }
      if (!done) {
        let songs;
        const instance = axios.create({
          headers: { Authorization: "Bearer " + spotifyToken }
        });
        instance
          .get("https://api.spotify.com/v1/me/top/tracks")
          .then(result => result.data.items)
          .then(items => {
            //obtain top 20 songs of an user from Spotify
            songs = items;
            let helper = item => {
              let artist = item.artists[0].name;
              let title = item.name;
              //use genius API to obtain lyrics urls
              return genius.search(`${artist} ${title}`).then(data => {
                if (data.hits[0]) {
                  if (
                    data.hits[0].result.full_title.indexOf(title) > -1 ||
                    data.hits[0].result.full_title.indexOf(artist) > -1
                  )
                    return data.hits[0].result.url;
                }
              });
            };
            const promises = items.map(item => helper(item));
            Promise.all(promises).then(values => {
              //Use cheerio web scraper to get lyric text from the urls
              let helper2 = url => {
                return axios.get(url).then(html => {
                  let $ = cheerio.load(html.data);
                  let lyric = $(".lyrics").text();
                  return lyric;
                });
              };
              values = values.filter(url => url);
              const promises2 = values.map(url => helper2(url));
              Promise.all(promises2).then(result => {
                //Combine text into single string and send to IBM Watson API
                let text = result.join("");
                let profileParams = {
                  content: text,
                  content_type: "text/plain",
                  consumption_preferences: true,
                  raw_scores: true
                };
                personalityInsights.profile(profileParams, function(
                  error,
                  profile
                ) {
                  if (error) {
                    console.log(error);
                  } else {
                    //insert gathered data into database for caching
                    let personality = JSON.parse(
                      JSON.stringify(profile, null, 2)
                    );
                    Profile.findOneAndUpdate(
                      { id: id },
                      {
                        $set: {
                          personality: JSON.stringify(personality),
                          songs: JSON.stringify(songs),
                          values: JSON.stringify(values)
                        }
                      },
                      { upsert: true }
                    ).then(() => {
                      id = null;
                      spotifyToken = null;
                      res.status(200).send([personality, songs, values]);
                    });
                  }
                });
              });
            });
          });
      }
    });
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`listening on port ${process.env.PORT || 3000}`);
});
