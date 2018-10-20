import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Personality from './components/personality.jsx';
import {Radar} from 'react-chartjs-2';

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
				console.log(res.data[0])
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

		const imgStyle = {
			textAlign: 'center',
			width: '50%',
			display: 'block',
			marginLeft: 'auto',
			marginRight: 'auto'
		}

		const chartStyle = {
			justifyContent: 'space-between',
			alignItems: 'center'
		}

		const empty = this.state.profile.hasOwnProperty('word_count');

	

		if (!empty) {
	
			return (
				<div>
					<h1>Music Taste Personality Insights</h1>
					<p>This app inputs the lyrics of your 20 current top songs from Spotify into IBM Watson's Personality Insights to determine your personality from your music taste</p>
					<a href="/auth/spotify/">Login</a><br/><br/>
					<form onSubmit={this.handleSubmit}>
						<button type="submit">Retrieve Personality Profile</button>
					</form><br/>
					<img src="http://www.da6nci.com/wp-content/uploads/2015/09/IBM_Watson_PersonalityInsights.svg" style={imgStyle} alt="logo"/>
				</div>
			)
		} else {
			const data = {
				labels: this.state.profile.needs.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.needs.map(val => val.percentile)
					}
				]
			};

			const data1 = {
				labels: this.state.profile.personality[0].children.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.personality[0].children.map(val => val.percentile)
					}
				]
			};

			const data2 = {
				labels: this.state.profile.personality[1].children.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.personality[1].children.map(val => val.percentile)
					}
				]
			};

			const data3 = {
				labels: this.state.profile.personality[2].children.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.personality[2].children.map(val => val.percentile)
					}
				]
			};

			const data4 = {
				labels: this.state.profile.personality[3].children.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.personality[3].children.map(val => val.percentile)
					}
				]
			};

			const data5 = {
				labels: this.state.profile.personality[4].children.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.personality[4].children.map(val => val.percentile)
					}
				]
			};

			const data6 = {
				labels: this.state.profile.values.map(val => val.name),
				datasets: [
					{
						label: 'Needs',
						backgroundColor: 'rgba(0,119,204,0.2)',
						borderColor: 'rgba(0,119,204, 0.5)',
						data: this.state.profile.values.map(val => val.percentile)
					}
				]
			};

			const options = {
				scale: {
					 ticks: {
							display: false,
							maxTicksLimit: 3
					 }
				}
		 }
		
		return (<div>
      <h1>Music Taste Personality Insights</h1>
			<p>This app inputs the lyrics of your 20 current top songs from Spotify into IBM Watson's Personality Insights to determine your personality from your music taste</p>
			<a href="/auth/spotify/">Login</a><br/><br/>
			<form onSubmit={this.handleSubmit}>
				<button type="submit">Retrieve Personality Profile</button>
			</form><br/>
			<h1>Top Songs</h1>
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
						<li style={{fontWeight: 'bold'}} key={need.trait_id}>{need.name} {need.percentile.toFixed(2)}</li>
					)
				} else if (need.percentile > 0.66) {
					return (
						<li style={{fontStyle: 'italic'}} key={need.trait_id}>{need.name} {need.percentile.toFixed(2)}</li>
					)
				} else if (need.percentile < 0.33) {
					return (
						<li key={need.trait_id} style={{color: 'red'}}>{need.name} {need.percentile.toFixed(2)}</li>
					)
				} else {
					return (
						<li key={need.trait_id}>{need.name} {need.percentile.toFixed(2)}</li>
					)
				}
			})}
			<Radar data={data} options={options} style={chartStyle}/>


			<h2>Big Five Personality</h2>
			<h3>Openness Facets</h3>
			<Personality facets={this.state.profile.personality[0].children}/>
			<Radar data={data1} options={options} style={chartStyle}/>
			<h3>Conscientiousness Facets</h3>
			<Personality facets={this.state.profile.personality[1].children}/>
			<Radar data={data2} options={options} style={chartStyle}/>

			<h3>Extraversion Facets</h3>
			<Personality facets={this.state.profile.personality[2].children}/>
			<Radar data={data3} options={options} style={chartStyle}/>

			<h3>Agreeableness Facets</h3>
			<Personality facets={this.state.profile.personality[3].children}/>
			<Radar data={data4} options={options} style={chartStyle}/>

			<h3>Neuroticism Facets</h3>
			<Personality facets={this.state.profile.personality[4].children}/>
			<Radar data={data5} options={options} style={chartStyle}/>


			<h2>Values</h2>
			<Personality facets={this.state.profile.values}/>
			<Radar data={data6} options={options} style={chartStyle}/>

    </div>)
  }}
}




ReactDOM.render(<App />, document.getElementById('app'));
