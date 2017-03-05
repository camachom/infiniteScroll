// @flow

import React, { Component } from 'react';
import data from '../data/pins_formatted.json';
import List from './List.jsx';
import Pin from './Pin.jsx';
import './App.css';

class App extends Component {

  render() {
    // NOTE: this needs to change
    const pinHeight = 500;
    return (
      <List id="List" pins={data} pinHeight={pinHeight}/>
    );
  }
}

// <div className="App">
//   {data.slice(0,1).map( pin => {
//     return <Pin key={pin.id} pin={pin} />;
//   })}
// </div>
export default App;
