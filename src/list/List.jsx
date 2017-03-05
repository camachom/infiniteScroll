// @flow

import React, { PropTypes } from 'react';
import ListBody from '../listBody/ListBody.jsx';
import _ from 'lodash';
import './List.css';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.clientHeight = window.innerHeight;
    this.pinsPerPage = Math.floor(this.clientHeight / this.props.pinHeight);

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
    const visibleStart = Math.floor(scrollTop / this.props.pinHeight);
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
      <div onScroll={this.handleScrollEvent} className="List" style={{height: this.clientHeight}}>
        <ListBody
          pins={this.props.pins}
          visibleStart={this.state.visibleStart}
          visibleEnd={this.state.visibleEnd}
          displayStart={this.state.displayStart}
          displayEnd={this.state.displayEnd}
          pinHeight={this.props.pinHeight}
          totalPins={this.props.pins.length}
          />
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
