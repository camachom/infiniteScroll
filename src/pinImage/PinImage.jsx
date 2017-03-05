import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import "./PinImage.css";

const PinImage = ({pin, openModal, closeModal, showModal}) => {
  // NOTE: changed image to 736 form 236
  const imageURL = pin.images["736x"]["url"];
  const imageURLModal = pin.images["736x"]["url"];

  return (
    <div>
      <Modal
        isOpen={showModal}
        contentLabel="Pin Image Modal"
        onRequestClose={closeModal}
        className="Modal">
        <img src={imageURLModal} alt="Pin Component"/>
        </ Modal>
        <img className="pinImage" src={imageURL} alt="Pin Component" onClick={openModal}/>
    </div>
  );
};

PinImage.propTypes = {
  pin: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default PinImage;
