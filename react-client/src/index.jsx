import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Personality from "./components/personality.jsx";
import { Radar } from "react-chartjs-2";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import SongList from "./components/songList.jsx";
import Preferences from "./components/preferences.jsx";
import Needs from "./components/needs.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      profile: {},
      urls: [],
      loading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    axios.get("/lyrics").then(res => {
      this.setState({
        songs: res.data[1],
        profile: res.data[0],
        urls: res.data[2],
        loading: false
      });
    });
  }

  render() {
    const imgStyle = {
      textAlign: "center",
      width: "50%",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    };

    const chartStyle = {
      justifyContent: "space-between",
      alignItems: "center"
    };

    const loadStyle = {
      height: "1000px",
      textAlign: "center"
    };

    const empty = this.state.profile.hasOwnProperty("word_count");

    if (this.state.loading) {
      return (
        <main>
          <div>
            <div>
              <h1>Music Taste Personality Insights</h1>
              <div style={loadStyle}>
                <img
                  src="https://loading.io/spinners/ripple/lg.ripple-radio-preloader.gif"
                  alt="loading gif"
                  className="load"
                />
              </div>
            </div>
          </div>
        </main>
      );
    }

    if (!empty) {
      return (
        <div>
          <h1>Music Taste Personality Insights</h1>
          <p>
            This app inputs the lyrics of your 20 current top songs from Spotify
            into IBM Watson's Personality Insights to determine your personality
            from your music taste
          </p>
          <a href="/auth/spotify/">Login to your Spotify Account</a>
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <Button type="submit">Retrieve Personality Profile</Button>
          </form>
          <br />
          <img
            src="http://www.da6nci.com/wp-content/uploads/2015/09/IBM_Watson_PersonalityInsights.svg"
            style={imgStyle}
            alt="logo"
          />
        </div>
      );
    } else {
      function dataTemplate(category, name) {
        return {
          labels: category.map(val => val.name),
          datasets: [
            {
              label: name,
              backgroundColor: "rgba(0,119,204,0.2)",
              borderColor: "rgba(0,119,204, 0.5)",
              data: category.map(val => val.percentile)
            }
          ]
        };
      }
      const pTypes = [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism"
      ];
      const nData = dataTemplate(this.state.profile.needs, "Needs");
      const pObj = {};
      for (var i = 0; i < 5; i++) {
        pObj[i] = dataTemplate(
          this.state.profile.personality[i].children,
          pTypes[i]
        );
      }

      const vData = dataTemplate(this.state.profile.values, "Values");

      const options = {
        scale: {
          ticks: {
            display: false,
            maxTicksLimit: 3
          }
        }
      };

      return (
        <div>
          <h1>Music Taste Personality Insights</h1>
          <p>
            This app inputs the lyrics of your 20 current top songs from Spotify
            into IBM Watson's Personality Insights to determine your personality
            from your music taste
          </p>
          <a href="/auth/spotify/">Login to your Spotify Account</a>
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <button type="submit">Retrieve Personality Profile</button>
          </form>
          <br />
          <h1>Top Songs</h1>
          <ol>
            <SongList songs={this.state.songs} urls={this.state.urls} />
          </ol>
          <h1>Personality Insights</h1>
          <h2>Preferences</h2>
          <Preferences prefs={this.state.profile.consumption_preferences} />
          <h2>Needs</h2>
          <Needs needs={this.state.profile.needs} />
          <Radar data={nData} options={options} style={chartStyle} />

          <h2>Big Five Personality</h2>
          {this.state.profile.personality.map((personality, i) => {
            return (
              <main key={i} className="bottom">
                <h3>{pTypes[i]}</h3>
                <Personality facets={personality.children} />
                <Radar data={pObj[i]} options={options} style={chartStyle} />
              </main>
            );
          })}
          <h2>Values</h2>
          <Personality facets={this.state.profile.values} />
          <Radar data={vData} options={options} style={chartStyle} />
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
