// @flow

import React, { PropTypes } from 'react';
import './Pin.css';

type Props = {
  pin: Object
}

class Pin extends React.Component {
  props: Props;

  render () {
    const pin = this.props.pin;
    const imageURL = pin.images["236x"]["url"];
    const title = pin.title;
    const description = pin.description;

    return(
      <div className="Pin">
        <h3>{title}</h3>
        <img src={imageURL} alt="Pin Component"/>
        <div>{description}</div>
      </div>
    )
  }
}

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
