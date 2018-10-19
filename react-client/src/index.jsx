import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
			title: '',
			artist: '',
			lyrics: '',
			currTitle: '',
			emotion: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
	}
	
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const {title, artist} = this.state;
		axios.post('/lyrics', {title, artist})
			.then((res) => this.setState({
				title: '',
				artist: '',
				lyrics: res.data.lyrics,
				currTitle: res.data.title,
				emotion: 'Sentiment: ' + res.data.emotion
			}));
	}

	handleLogin() {
		axios.get('/login')
	}

  render () {
		const {title, artist} = this.state;
		
		return (<div>
      <h1>Lyrics App</h1>
			<button onClick={this.handleLogin}>Login</button><br/><br/>
			<form onSubmit={this.handleSubmit}>
				<label>Title</label><br/>
        <input type="text" name="title" value={title} onChange={this.onChange}/>
				<br/>
        <label>Artist</label><br/>
        <input type="text" name="artist" value={artist} onChange={this.onChange}/>
				<br/>
				<button type="submit">Submit</button>
			</form><br/>
			<h2>Lyrics</h2>
			<h3>{this.state.currTitle}</h3>
			<h4>{this.state.emotion}</h4>
			{this.state.lyrics.split("\n").map((i,key) => {
        return <div key={key}>{i}</div>;
      })}
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
