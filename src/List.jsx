// @flow

import React, { PropTypes } from 'react';
import Pin from './Pin.jsx';
import _ from 'lodash';
import './List.css';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {start_idx: 0, end_idx: 10, pins: this.props.pins.slice(0,10)};

    (this:any).handleScrollCalculations = _.throttle(this.handleScrollCalculations.bind(this), 200);
    (this:any).pinsToRender = this.pinsToRender.bind(this);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  handleScrollCalculations(e) {
    const scrHeight = e.target.scrollHeight;
    const scrTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;

    if (clientHeight + scrTop + 200 >= scrHeight) {
      const end_idx = this.state.end_idx;

      const newStartIdx = end_idx % 50;
      let newEndIdx = (newStartIdx + 10) % 50;
      // avoid getting an invalid range of (40..0)
      newEndIdx === 0 ? newEndIdx = 50 : null;

      const pins = this.pinsToRender(newStartIdx, newEndIdx);
      debugger;

      this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pins});
    }
  }

  handleScrollEvent(e: Object) {
    e.persist();
    this.handleScrollCalculations(e);
  }

  pinsToRender(startIdx, endIdx) {
    const newPins = this.props.pins.slice(startIdx, endIdx)

    const pinsToRender = this.state.pins.concat(newPins);
    return pinsToRender;
  }

  render() {

    return (
      <div onScroll={this.handleScrollEvent} className="List">
        {this.state.pins.map( (pin, idx) => {
          return <Pin key={pin.id * idx} pin={pin} />;
        })}
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
