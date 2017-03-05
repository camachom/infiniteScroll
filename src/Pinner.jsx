import React, { PropTypes } from 'react';
import './Pinner.css';

const Pinner = ({pin}) => {
  const boardURL = `https://www.pinterest.com${pin.board.url}`;
  return (
    <a href={boardURL} className="pinner">
      <object data={pin.pinner.image_small_url} type="image/png" className="pinnerImage">
        <img
          src="http://res.cloudinary.com/doilr7vvv/image/upload/v1488671075/genericUser_denhyl.png"
          alt="Pinner picture"
          className="pinnerImage">
        </img>
      </object>
      <div className="pinnerUsernameBoard" >
        <p className="pinnerUsername">{pin.pinner.username}</p>
        <p className="pinnerBoardname">{pin.board.name}</p>
      </div>
    </a>
  );
};

export default Pinner;
