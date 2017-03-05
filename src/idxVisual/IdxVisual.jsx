import React, { PropTypes } from 'react';
import './IdxVisual.css';

const IdxVisual = ({displayStart, displayEnd, totalPins}) => {
  return (
    <div className="idxRangeContainer">
      <p className="idxRange" >Rendering elements from {displayStart % totalPins} to {displayEnd % totalPins}</p>
    </div>
  );
};

export default IdxVisual;
