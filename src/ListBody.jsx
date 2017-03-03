import React from 'react';
import Pin from './Pin.jsx';
import EmptySpace from './EmptySpace.jsx';
import _ from 'lodash';

class ListBody extends React.Component {
  constructor(props){
    super(props);

    this.state = ({
      // shouldUpdate: true,
      pins: this.props.totalPins,
      displayStart: 0,
      displayEnd: 0
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log("here");

    // const compareVisibility = !(nextProps.visibleStart >= this.state.displayStart && nextProps.visibleEnd <= this.state.displayEnd);

    // const compareVisibility = true;
    //
    // let diffTotal = nextProps.pins !== this.state.pins;
    //
    // const shouldUpdate = compareVisibility || diffTotal;
    //
    // if (shouldUpdate) {
      this.setState({
        pins: nextProps.pins,
        displayStart: nextProps.displayStart,
        displayEnd: nextProps.displayEnd
      });

    //   });
    // } else {
    //     this.setState({
    //       shouldUpdate: false
    //     });
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.shouldUpdate;
  // }
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextState, this.state) &&
           !_.isEqual(nextProps, this.props);
  }

  render () {
    console.log('jordan is great!');
    let pins = [];
    for (let i = this.props.displayStart; i < this.props.displayEnd; i++) {
      pins.push(<Pin key={i} pin={this.props.pins[i]} />);
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
