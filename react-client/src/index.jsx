import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Personality from './components/personality.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
			songs: [],
			profile: {},
			urls: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
  }	

	handleSubmit(e) {
		e.preventDefault();
		axios.get('/lyrics')
			.then((res) => {
				console.log('res')
				this.setState({
					songs: res.data[1],
					profile: res.data[0],
					urls: res.data[2]
				})
			});
	}

  render () {
		const style = {
			textDecoration: 'none'
		}

		const empty = this.state.profile.hasOwnProperty('word_count');

		if (!empty) {
			return (
				<div>
					<h1>Music Taste Personality Test</h1>
					<p>This app inputs the lyrics of your 20 current top songs from Spotify into IBM Watson's Personality Insights to determine your personality from music tastes</p>
					<a href="/auth/spotify/">Login</a><br/><br/>
					<form onSubmit={this.handleSubmit}>
						<button type="submit">Retrieve Personality Profile</button>
					</form><br/>
				</div>
			)
		}

		return (<div>
      <h1>Music Taste Personality Test</h1>
			<p>This app inputs the lyrics of your 20 current top songs from Spotify into IBM Watson's Personality Insights to determine your personality from music tastes</p>
			<a href="/auth/spotify/">Login</a><br/><br/>
			<form onSubmit={this.handleSubmit}>
				<button type="submit">Retrieve Personality Profile</button>
			</form><br/>
			<h1>Top Songs</h1><br/>
			<ol>
			{this.state.songs.map((song, i) => {
				return(
					<li key={song.uri}><a href={song.external_urls.spotify} style={style}>{song.album.artists[0].name} - {song.name}</a><a href={this.state.urls.filter(url => {
						return url.toLowerCase().indexOf((song.album.artists[0].name.replace(/\s+/g, '-').toLowerCase())) > -1 
						|| url.toLowerCase().indexOf((song.name.replace(/\s+/g, '-').toLowerCase())) > -1;
					})[0]} style={style}> Lyrics</a></li>
				)
			})}
			</ol>
			<h1>Personality Insights</h1> 

			<h2>Preferences</h2>
			{this.state.profile.consumption_preferences.map(prefCategory => {
				return prefCategory.consumption_preferences.map(pref => {
					if (pref.score === 1) {
						return (
							<li key={pref.consumption_preference_id}>{pref.name}</li>
						)
					}
				})
			})}

			<h2>Needs</h2>
			{this.state.profile.needs.map(need => {
				if (need.percentile > 0.8) {
					return (
						<li key={need.trait_id}>{need.name}</li>
					)
				}
			})}

			<h2>Big Five Personality</h2>
			<h3>Openness Facets</h3>
			<Personality facets={this.state.profile.personality[0].children}/>
			<h3>Conscientiousness Facets</h3>
			<Personality facets={this.state.profile.personality[1].children}/>
			<h3>Extraversion Facets</h3>
			<Personality facets={this.state.profile.personality[2].children}/>
			<h3>Agreeableness Facets</h3>
			<Personality facets={this.state.profile.personality[3].children}/>
			<h3>Neuroticism Facets</h3>
			<Personality facets={this.state.profile.personality[4].children}/>

			<h2>Values</h2>
			<Personality facets={this.state.profile.values}/>
    </div>)
  }
}




ReactDOM.render(<App />, document.getElementById('app'));
