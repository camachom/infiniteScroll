// @flow

import React, { PropTypes } from 'react';
import { PinterestPinWidget } from 'react-pinterest';
// import Pin from './Pin.jsx';
import _ from 'lodash';
import './List.css';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {start_idx: 0, end_idx: 10, pins: [], cache: {}};

    (this:any).handleScrollCalculations = _.throttle(this.handleScrollCalculations.bind(this), 250);
    // (this:any).widget = this.widget.bind(this);
    (this:any).pinsToRender = this.pinsToRender.bind(this);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  componentWillMount() {
    const cache = {};
    const pinIds = this.props.pins.slice(0,10).map( pin => {
      if(!cache[pin.id]) {
        cache[pin.id] = <PinterestPinWidget key={pin.id} size="small" pin={pin.id}/>
      }
      return pin.id;
    });
    this.setState({pins: pinIds, cache: cache});
  }

  handleScrollCalculations(e) {
    const scrHeight = e.target.scrollHeight;
    const scrTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;

    if (clientHeight + scrTop + 100 >= scrHeight) {
      const end_idx = this.state.end_idx;

      const newStartIdx = end_idx % 50;
      const newEndIdx = (newStartIdx + 10) % 50;
      const pins = this.pinsToRender(newStartIdx, newEndIdx);

      // caching the previously rendered components
      debugger;
      const pinIds = pins.map( (pinId, idx) => {
        if(!this.state.cache[pinId]) {
          this.state.cache[pinId] = <PinterestPinWidget key={pinId} size="small" pin={pinId}/>
        }
        return pinId;
      });

      this.setState({start_idx: newStartIdx, end_idx: newEndIdx, pins: pinIds, cache: this.state.cache});
    }
  }

  handleScrollEvent(e: Object) {
    e.persist();
    this.handleScrollCalculations(e);
  }

  // componentDidMount(nextProps: Object, nextState: Object) {
  //   this.widget();
  // }
  //
  // componentWillUpdate(){
  //   const remove = this.widget();
  //   if (remove) {
  //     remove.remove();
  //   }
  // }

  // widget() {
  //   let firstScript, newScript, hazPinIt;
  //
  //   // generate an unique-ish global ID: hazPinIt_ plus today's Unix day
  //   hazPinIt = 'PIN_' + ~~(new Date().getTime() / 86400000);
  //
  //   if (!window[hazPinIt]) {
  //
  //     // don't run next time
  //     // w[hazPinIt] = true;
  //     if (this.state.end_idx >= 50) {
  //       window[hazPinIt] = true;
  //     }
  //
  //     // avoid KB927917 error in IE8
  //     // window.setTimeout(function () {
  //       // load the bulk of pinit.js
  //       firstScript = document.getElementsByTagName('SCRIPT')[0];
  //       newScript = document.createElement('SCRIPT');
  //       newScript.type = 'text/javascript';
  //       newScript.async = true;
  //       newScript.src = '//assets.pinterest.com/js/pinit_main.js';
  //       firstScript.parentNode.insertBefore(newScript, firstScript);
  //     // }, 10);
  //       return newScript;
  //   }
  // }

  pinsToRender(startIdx, endIdx) {
    const newPinIds = this.props.pins.slice(startIdx, endIdx).map( pin =>{
      return pin.id;
    })

    const pinsToRender = this.state.pins.concat(newPinIds);
    return pinsToRender;
  }

  render() {

    return (
      <div onScroll={this.handleScrollEvent} className="List">
        {this.state.pins.map( pin => {
          return this.state.cache[pin];
        })}
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;

// {this.state.pins.map( (pin, idx) => {
// return <PinterestPinWidget size="small" pin={pin.id}/>
// return <Pin key={pin.id + Date.now() * idx} pin={pin} />;
// })}
// <div dangerouslySetInnerHTML={{__html: `<script async defer src="//assets.pinterest.com/js/pinit.js"></script>"`}}/>
