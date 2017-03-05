import React from 'react';
import Pin from '../pin/Pin.jsx';
import EmptySpace from '../emptySpace/EmptySpace.jsx';
import _ from 'lodash';

class ListBody extends React.Component {
  constructor(props){
    super(props);

    this.state = ({
      pins: this.props.totalPins,
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
    return !_.isEqual(nextState, this.state) &&
           !_.isEqual(nextProps, this.props);
  }

  pinsToRender() {
    let pins = [];
    for (let i = this.props.displayStart; i < this.props.displayEnd; i++) {
      pins.push(<Pin key={i % this.props.totalPins} pin={this.props.pins[i % this.props.totalPins]} />);
    }

    return pins;
  }

  render () {
    const pins = this.pinsToRender();

    return(
      <div>
        <EmptySpace
          height={this.props.displayStart * this.props.pinHeight}
        />
        {pins}
      </div>
    );
  }
}

export default ListBody;
