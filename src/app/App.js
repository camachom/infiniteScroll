// @flow

import React, { Component } from 'react';
import data from '../../data/pins_formatted.json';
import List from '../list/List.jsx';
import './App.css';

class App extends Component {
  render() {
    const pinHeight = 500;
    return (
      <div>
        <List id="List" pins={data} pinHeight={pinHeight}/>
        <a className="githubLogo" href="https://github.com/camachom/pinterestChallenge">
          <img src="http://res.cloudinary.com/doilr7vvv/image/upload/v1473100780/GitHub-Mark-64px_s4eyzw.png" alt="github logo"></img>
        </a>
      </div>
    );
  }
}

export default App;
