// @flow

import React, { PropTypes } from 'react';
import Pin from './Pin.jsx';
import _  from 'lodash';
import './List.css';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;

  constructor() {
    super();
    this.state = {start_idx: 0, end_idx: 8, didScroll: false, element: null};

    (this:any).handleScrollCalculations = _.throttle(this.handleScrollCalculations.bind(this), 250);
    (this:any).widget = this.widget.bind(this);
    (this:any).renderPins = this.renderPins.bind(this);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  handleScrollCalculations(e) {
    const scrHeight = e.target.scrollHeight;
    const scrTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;

    if (clientHeight + scrTop + 100 >= scrHeight) {
      const end_idx = this.state.end_idx;
      this.setState({end_idx: end_idx + 8, didScroll: false});
    }
  }

  handleScrollEvent(e: Object) {
    e.persist();
    this.handleScrollCalculations(e);
  }

  componentDidMount(nextProps: Object, nextState: Object) {
    this.widget();
  }

  componentWillUpdate(){
    this.widget();
  }

  widget() {
    let firstScript, newScript, hazPinIt;

    // generate an unique-ish global ID: hazPinIt_ plus today's Unix day
    hazPinIt = 'PIN_' + ~~(new Date().getTime() / 86400000);

    if (!window[hazPinIt]) {

      // don't run next time
      // w[hazPinIt] = true;
      if (this.state.end_idx >= 50) {
        window[hazPinIt] = true;
      }

      // avoid KB927917 error in IE8
      window.setTimeout(function () {
        // load the bulk of pinit.js
        firstScript = document.getElementsByTagName('SCRIPT')[0];
        newScript = document.createElement('SCRIPT');
        newScript.type = 'text/javascript';
        newScript.async = true;
        newScript.src = '//assets.pinterest.com/js/pinit_main.js';
        firstScript.parentNode.insertBefore(newScript, firstScript);
      }, 10);
    }
  }

  renderPins() {
    const pinsToRender = this.props.pins.slice(this.state.start_idx, this.state.end_idx);

    const renderedPins = pinsToRender.map( (pin, idx) => {
      return <Pin key={pin.id} pin={pin} />;
    });

    return renderedPins;
  }

  render() {
    const pins = this.renderPins();
    return (
      <div
        onScroll={this.handleScrollEvent}
        className="List"
      >
        {pins}
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
