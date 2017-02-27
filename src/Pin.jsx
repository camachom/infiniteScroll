// @flow

import React, { PropTypes } from 'react';

type Props = {
  pin: Object
}

const Pin = (props: Props) => {
  const link = `https://www.pinterest.com/pin/${props.pin.id}/`;
  return (
    <a data-pin-do="embedPin" href={link}></a>
  );
};

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
