import React, { PropTypes } from 'react';
import './Pinner.css';

const Pinner = ({pin}) => {
  const boardURL = `https://www.pinterest.com${pin.board.url}`;
  return (
    <a href={boardURL} className="pinner">
      <img
        src={pin.pinner.image_small_url}
        alt="Pinner picture"
        className="pinnerImage">
      </img>
      <div className="pinnerUsernameBoard" >
        <p>{pin.pinner.username}</p>
        <p>{pin.board.name}</p>
      </div>
    </a>
  );
};

export default Pinner;
