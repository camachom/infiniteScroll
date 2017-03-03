// @flow
// @flow

import React, { PropTypes } from 'react';
import ListBody from './ListBody.jsx';
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
    this.pins = this.props.pins;
    // have to fix pins per page to make more universal
    this.pinHeight = 300;
    this.pinsPerPage = 600 / this.pinHeight;

    this.state = {
      visibleStart: 0,
      visibleEnd: this.pinsPerPage,
      displayStart: 0,
      displayEnd: this.pinsPerPage * 2,
    };

    // NOTE: do i need to throttle anymore?
    (this:any).scrollState = _.throttle(this.scrollState.bind(this), 100);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  scrollState(scrollTop) {
    const visibleStart = Math.floor(scrollTop / this.pinHeight);
    const visibleEnd = Math.min(visibleStart + this.pinsPerPage, this.totalPins -1)

    const displayStart = Math.max(0, visibleStart - this.pinsPerPage * 1.5);
    const displayEnd = Math.min(displayStart + (4 * this.pinsPerPage), this.totalPins - 1);

    const newState = {
      visibleStart: visibleStart,
      visibleEnd: visibleEnd,
      displayStart: displayStart,
      displayEnd: displayEnd,
    };

    // const sameState = _.isEqual(newState, this.state);
    //
    // if (!sameState) {
      this.setState(newState);
    // }
  }

  handleScrollEvent(e: Object) {
    e.persist();
    this.scrollState(e.target.scrollTop);
  }

  render() {

    return (
      <div onScroll={this.handleScrollEvent} className="List">
        <ListBody
          pins={this.pins}
          visibleStart={this.state.visibleStart}
          visibleEnd={this.state.visibleEnd}
          displayStart={this.state.displayStart}
          displayEnd={this.state.displayEnd}
          pinHeight={this.pinHeight}
          totalPins={this.totalPins}
          />
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
