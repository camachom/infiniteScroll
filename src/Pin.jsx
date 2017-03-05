
// @flow

import React, { PropTypes } from 'react';
import Pinner from './Pinner.jsx';
import './Pin.css';

type Props = {
  pin: Object
}

class Pin extends React.Component {
  props: Props;

  render () {
    const pin = this.props.pin;
    const imageURL = pin.images["236x"]["url"];
    let title = pin.title;
    title.length <= 0 ? title = "Untitled =(" : null;
    const description = pin.description;

    return(
      <div className="Pin">
        <img className="pinImage" src={imageURL} alt="Pin Component"/>
        <div className="pinTitleCount">
          <h3 className="pinTitle">{title}</h3>
          <div>
            <img    src="http://res.cloudinary.com/doilr7vvv/image/upload/v1488659829/pinIcon_hqbzqq.png" alt="Pin count icon" className="pinRepinCountIcon"/>
            <span className="pinRepinCount">  {pin.repin_count}</span>
          </div>
        </div>
        <p className="pinDescription">{description}</p>
        <p className="pinDomain">{pin.domain}</p>
        <div className="pinTitleBoardContainer">
          <span className="pinDomainTitle">From</span>
          <span className="pinnerBoardname">  {pin.board.name}</span>
        </div>
        <Pinner pin={pin} />
      </div>
    )
  }
}

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
