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
    this.pinHeight = this.props.height;
    this.pinsPerPage = 600 / this.pinHeight;

    this.state = {
      visibleStart: 0,
      visibleEnd: this.pinsPerPage,
      displayStart: 0,
      displayEnd: this.pinsPerPage * 8,
    };

    (this:any).scrollState = _.throttle(this.scrollState.bind(this), 100);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  scrollState(scrollTop) {
    const visibleStart = Math.floor(scrollTop / this.pinHeight);
    const visibleEnd = visibleStart + this.pinsPerPage

    const displayStart = Math.max(0, visibleStart - this.pinsPerPage * 3);
    const displayEnd = displayStart + (8 * this.pinsPerPage);

    const newState = {
      visibleStart: visibleStart,
      visibleEnd: visibleEnd,
      displayStart: displayStart,
      displayEnd: displayEnd,
    };

    this.setState(newState);
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
