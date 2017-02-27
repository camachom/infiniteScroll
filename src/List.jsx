// @flow

import React, { PropTypes } from 'react';
import Pin from './Pin.jsx';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;
  render() {
    return (
      <div>
        {this.props.pins.map( pin => {
          return <Pin key={pin.id} pin={pin} />;
        })}
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
