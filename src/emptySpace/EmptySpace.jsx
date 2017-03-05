import React from 'react';

const EmptyDiv = ({height}) => {
  return (
    <div className="empty" key={height} style={{height: height, width: "100%"}}/>
  );
};

export default EmptyDiv;
