// @flow

import React, { Component } from 'react';
import data from '../data/pins_formatted.json';
import List from './List.jsx';
import './App.css';

class App extends Component {
  render() {
    const height = 300;
    return (
      <div className="App">
        <List pins={data} height={height}/>
      </div>
    );
  }
}

export default App;
