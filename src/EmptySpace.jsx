import React from 'react';

const EmptyDiv = ({height}) => {
  return (
    <div className="empty" key={height} style={{height: height}}/>
  );
};

export default EmptyDiv;
