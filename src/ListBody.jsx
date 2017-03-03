import React from 'react';
import Pin from './Pin.jsx';
import EmptySpace from './EmptySpace.jsx';
import _ from 'lodash';

class ListBody extends React.Component {
  constructor(props){
    super(props);

    this.state = ({
      pins: this.props.totalPins,
      displayStart: 0,
      displayEnd: 0
    });
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

  render () {
    console.log('jordan is great!');
    let pins = [];
    for (let i = this.props.displayStart; i < this.props.displayEnd; i++) {
      pins.push(<Pin key={i % this.props.totalPins} pin={this.props.pins[i % this.props.totalPins]} />);
    }

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
