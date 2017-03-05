// @flow

import React, { PropTypes } from 'react';
import Pinner from '../pinner/Pinner.jsx';
import PinImage from '../pinImage/PinImage.jsx';
import PinTitle from '../pinTitle/PinTitle.jsx';
import PinBody from '../pinBody/PinBody.jsx';
import './Pin.css';

type Props = {
  pin: Object
}

class Pin extends React.Component {
  props: Props;

  constructor () {
    super();
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render () {
    const pin = this.props.pin;
    const pinURL = `https://www.pinterest.com/pin/${pin.id}`

    return(
      <div className="Pin">
        <PinImage pin={pin} openModal={this.handleOpenModal} closeModal={this.handleCloseModal} showModal={this.state.showModal}/>
        <a className="pinTitleBody" href={pinURL}>
          <PinTitle title={pin.title.length <= 0 ? "Untitled =(" : pin.title} repinCount={pin.repin_count} />
          <PinBody description={pin.description} domain={pin.domain} boardName={pin.board.name}/>
        </a>
        <Pinner pin={pin} />
      </div>
    )
  }
}

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
