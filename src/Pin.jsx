
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
        <img className="pinImage" src={imageURL} alt="Pin Component"/>
        <div className="pinTitleCount">
          <h3 className="pinTitle">{title}</h3>
          <p className="pinRepinCount">{pin.repin_count}</p>
        </div>
        <p className="pinDescription">{description}</p>
        <h4 className="pinDomainTitle">Saved from</h4>
        <p className="pinDomain">{pin.domain}</p>
      </div>
    )
  }
}

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
