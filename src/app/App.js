// @flow

import React, { Component } from 'react';
import data from '../../data/pins_formatted.json';
import List from '../list/List.jsx';
import './App.css';

class App extends Component {
  render() {
    const pinHeight = 500;
    return (
      <List id="List" pins={data} pinHeight={pinHeight}/>
    );
  }
}

export default App;
