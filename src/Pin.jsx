// @flow

import React, { PropTypes } from 'react';

type Props = {
  pin: Object
}

class Pin extends React.Component {
  props: Props;

  render () {
    const id = this.props.pin.id;
    return(
      <a data-pin-do="embedPin" href={`https://www.pinterest.com/pin/${id}/`}></a>
    )
  }
}

Pin.propTypes = {
  pin: PropTypes.object.isRequired
};

export default Pin;
