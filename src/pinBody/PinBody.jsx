import React, { PropTypes } from 'react';
import './PinBody.css';

const PinBody = ({description, domain, boardName}) => {
  return (
    <div>
      <p className="pinDescription">{description}</p>
      <p className="pinDomain">{domain}</p>
      <div className="pinTitleBoardContainer">
        <span className="pinDomainTitle">From</span>
        <span className="pinnerBoardname">  {boardName}</span>
      </div>
    </div>
  );
};

PinBody.propTypes = {
  description: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired
};

export default PinBody;
