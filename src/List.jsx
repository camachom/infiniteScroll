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
    this.state = {start_idx: 0, end_idx: 10, pins: this.props.pins.slice(0,10), rounds: 0, maxRounds: 0};

    (this:any).handleScrollCalculations = _.throttle(this.handleScrollCalculations.bind(this), 200);
    (this:any).pinsToRender = this.pinsToRender.bind(this);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
    (this:any).calculatePinIdx = this.calculatePinIdx.bind(this);
    (this:any).downScrollCalc = this.downScrollCalc.bind(this);
  }

  // change name to suit function
  calculatePinIdx(reOrderFlag) {
    const end_idx = this.state.end_idx;

    const newStartIdx = end_idx % 50;
    let newEndIdx = (newStartIdx + 10) % 50;
    // avoid getting an invalid range of (40..0)
    newEndIdx === 0 ? newEndIdx = 50 : null;
    // make this more readable

    let pins, rounds;
    if (reOrderFlag) {
      // keep state immutable by creating a copy
      const oldPins = this.props.pins.slice();
      // add ten empty divs here
      const emptyDivs = Array(10 * this.state.rounds).fill("empty div");
      const postEmpty = oldPins.slice(newEndIdx);
      const pastZeroPins = oldPins.slice(0, newEndIdx);

      pins = emptyDivs.concat(postEmpty.concat(pastZeroPins));
      rounds = this.state.rounds + 1;
    }
    else {
      pins = this.pinsToRender(newStartIdx, newEndIdx);
      rounds = this.state.rounds;
    }

    this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pins, rounds: rounds, maxRounds: rounds > this.state.maxRounds ? rounds : this.state.rounds});
  }

  downScrollCalc() {
    const start_idx = this.state.start_idx;

    let newStartIdx = this.state.start_idx - 10;
    start_idx === 0 ? newStartIdx = 40 : newStartIdx = start_idx - 10;
    let newEndIdx = (newStartIdx + 10) % 50;
    // avoid getting an invalid range of (40..0)
    newEndIdx === 0 ? newEndIdx = 50 : null;
    // make this more readable

    const newRounds = this.state.rounds - 1;
    // keep state immutable by creating a copy
    const originalPins = this.props.pins.slice();
    // add ten empty divs here
    const preEmptyDivs = Array(10 * newRounds).fill("empty div");
    const postEmptyDivs = Array(10 * (this.state.maxRounds - newRounds)).fill("empty div");
    const postEmpty = originalPins.slice(newStartIdx);
    const pastZeroPins = originalPins.slice(0, newStartIdx);

    const pins = preEmptyDivs.concat(postEmpty.concat(pastZeroPins.concat(postEmptyDivs)));

    this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pins, rounds: newRounds});
  }

  handleScrollCalculations(e) {
    const scrHeight = e.target.scrollHeight;
    const scrTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;
    const elementHeight = 300;

    if (clientHeight + scrTop + 200 + (this.state.rounds * elementHeight * 10) >= scrHeight) {
      let reOrderFlag;
      if (this.state.pins >= this.props.pins) {
        reOrderFlag = true
      }
      else {
        reOrderFlag = false
      }
      this.calculatePinIdx(reOrderFlag);
    }
    else if (this.state.rounds > 0 && scrTop - 200 <= (this.state.rounds * elementHeight * 10)) {
      this.downScrollCalc();
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
          // come up with a better flag for empty div
          if (pin === "empty div") {
            return <div key={idx * Date.now()} className="empty"/>;
          }
          else {
            return <Pin key={pin.id * idx} pin={pin} />;
          }
        })}
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
