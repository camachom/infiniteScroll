// @flow
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
    // constants
    this.totalPins = this.props.pins.length;
    this.pinsPerPage = 10;
    this.elementHeight = 300;

    this.state = {start_idx: 0, end_idx: this.pinsPerPage, pins: this.props.pins.slice(0, this.pinsPerPage), rounds: 0, maxRounds: 0};

    (this:any).handleScrollCalculations = _.throttle(this.handleScrollCalculations.bind(this), 200);
    (this:any).pinsToRender = this.pinsToRender.bind(this);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
    (this:any).upScrollCalc = this.upScrollCalc.bind(this);
    (this:any).downScrollCalc = this.downScrollCalc.bind(this);
    (this:any).downScrollIdxs = this.downScrollIdxs.bind(this);
    (this:any).upScrollIdxs = this.upScrollIdxs.bind(this);
  }

  // change name to suit function
  upScrollCalc(reOrderFlag) {
    const idxs = this.upScrollIdxs();
    const newStartIdx = idxs[0];
    const newEndIdx = idxs[1];

    let pins, rounds;
    // reOrder means the whole data set has been rendered at least once
    if (reOrderFlag) {
      // keep state immutable by creating a copy
      const oldPins = this.props.pins.slice();
      // add ten empty divs here
      const emptyDivs = Array(this.pinsPerPage * this.state.rounds).fill("empty div");
      const postEmpty = oldPins.slice(newEndIdx);
      const pastZeroPins = oldPins.slice(0, newEndIdx);

      pins = emptyDivs.concat(postEmpty.concat(pastZeroPins));
      rounds = this.state.rounds + 1;
      console.log(pins);
    }
    else {
      pins = this.pinsToRender(newStartIdx, newEndIdx);
      rounds = this.state.rounds;
    }

    this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pins, rounds: rounds, maxRounds: rounds > this.state.maxRounds ? rounds : this.state.rounds});
  }

  upScrollIdxs() {
    // NOTE: make this more readable
    const end_idx = this.state.end_idx;

    const newStartIdx = end_idx % this.totalPins;
    let newEndIdx = (newStartIdx + this.pinsPerPage) % this.totalPins;
    // avoid getting an invalid range of (40..0)
    newEndIdx === 0 ? newEndIdx = this.totalPins : null;

    return [newStartIdx, newEndIdx];
  }

  downScrollCalc() {
    // try to write this better
    const idxs = this.downScrollIdxs();
    const newStartIdx = idxs[0];
    const newEndIdx = idxs[1];

    const newRounds = this.state.rounds - 1;
    // keep state immutable by creating a copy
    const originalPins = this.props.pins.slice();
    // add ten empty divs here
    const preEmptyDivs = Array(this.pinsPerPage * newRounds).fill("empty div");
    const postEmptyDivs = Array(this.pinsPerPage * (this.state.maxRounds - newRounds)).fill("empty div");
    const prePins = originalPins.slice(newStartIdx);
    const postPins = originalPins.slice(0, newStartIdx);

    const pins = preEmptyDivs.concat(prePins, postPins, postEmptyDivs);

    this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pins, rounds: newRounds});
  }

  downScrollIdxs() {
    // NOTE: make this more readable
    const start_idx = this.state.start_idx;

    let newStartIdx = this.state.start_idx - this.pinsPerPage;
    start_idx === 0 ? newStartIdx = this.totalPins : newStartIdx = start_idx - this.pinsPerPage;
    let newEndIdx = (newStartIdx + this.pinsPerPage) % this.totalPins;
    // avoid getting an invalid range of (40..0)
    newEndIdx === 0 ? newEndIdx = this.totalPins : null;
    // make this more readable

    return [newStartIdx, newEndIdx];
  }

  handleScrollCalculations(e) {
    // adds elements from props to state with scroll
    const scrHeight = e.target.scrollHeight;
    const scrTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;

    // using 200 as a constant so that loading new elements starts before reaching bottom of the scroll bar

    const topRounds = this.state.maxRounds - this.state.rounds;

    if (clientHeight + scrTop + 200  + (topRounds * this.elementHeight * this.pinsPerPage) >= scrHeight) {
      let reOrderFlag;
      if (this.state.pins >= this.props.pins) {
        reOrderFlag = true
      }
      else {
        reOrderFlag = false
      }
      this.upScrollCalc(reOrderFlag);
    }
    else if (this.state.rounds > 0 && scrTop - 200 <= (this.state.rounds * this.elementHeight * this.pinsPerPage)) {
      this.downScrollCalc();
    }
  }

  handleScrollEvent(e: Object) {
    e.persist();
    this.handleScrollCalculations(e);
  }

  pinsToRender(startIdx, endIdx) {
    // adds elements from props to state with scroll
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
