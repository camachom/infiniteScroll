import React from 'react';
import Pin from '../pin/Pin.jsx';
import EmptySpace from '../emptySpace/EmptySpace.jsx';
import _ from 'lodash';
import './listBody.css';

class ListBody extends React.Component {
  constructor(props){
    super(props);

    this.state = ({
      pins: this.props.pins,
      displayStart: 0,
      displayEnd: 0
    });

    this.pinsToRender = this.pinsToRender.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pins: nextProps.pins,
      displayStart: nextProps.displayStart,
      displayEnd: nextProps.displayEnd
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // avoids unnecesary rerenderings trigegred by scroll event
    return !_.isEqual(nextState, this.state) &&
           !_.isEqual(nextProps, this.props);
  }

  pinsToRender() {
    const totalPins = this.props.pins.length;

    let pins = [];
    // renders only the pins between displayStart/End
    for (let i = this.props.displayStart; i < this.props.displayEnd; i++) {
      pins.push(<Pin key={i % totalPins} pin={this.props.pins[i % totalPins]} />);
    }

    return pins;
  }

  render () {
    const pins = this.pinsToRender();
    // added the 3 to the empty space and divided by 3
    return(
      <div className="listBody">
        <EmptySpace
          height={(Math.floor(this.props.displayStart / 3)) * this.props.pinHeight * 3}
        />
        {pins}
      </div>
    );
  }
}

export default ListBody;
