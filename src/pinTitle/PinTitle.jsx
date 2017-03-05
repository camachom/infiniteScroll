import React, { PropTypes } from 'react';
import './PinTitle.css';

const PinTitle = ({title, repinCount}) => {
  return (
    <div className="pinTitleCount">
      <h3 className="pinTitle">{title}</h3>
      <div>
        <img    src="http://res.cloudinary.com/doilr7vvv/image/upload/v1488659829/pinIcon_hqbzqq.png" alt="Pin count icon" className="pinRepinCountIcon"/>
        <span className="pinRepinCount">  {repinCount}</span>
      </div>
    </div>
  );
};

PinTitle.propTypes = {
  title: PropTypes.string.isRequired,
  repinCount: PropTypes.number.isRequired,
};

export default PinTitle;
