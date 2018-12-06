# Music Taste Personality Insights
A personality analyzer app that takes its insights from a user’s most listened Spotify songs with IBM Watson.

### Installing Dependencies

From within the root directory:

```sh
npm install
```

## Development
In ./server/index.js, uncomment code under for development only

In ./database-mongo.js, uncomment code under for development only

Create config.js file and save postgreSQL password in this format
```js
module.exports = {
	GENIUS_TOKEN: 'genius_api_token',
	SPOTIFY_CLIENT: 'spotify_client_token',
	SPOTIFY_SECRET: 'spotify_secret',
	IBM_KEY: 'ibm_watson_personality_insights_key',
	MONGO: 'mongodb_database_link'
};
```

To set up development environment:
```sh
# Compile bundle.js using Webpack
npm run build

# Start the server
npm run server-dev
```

Access the application at (http://localhost:3000)

## Deployment
Set env variables for GENIUS_TOKEN, SPOTIFY_CLIENT, SPOTIFY_SECRET, IBM_KEY, and MONGO

Example Heroku Deployment:
https://music-taste-personality.herokuapp.com/
