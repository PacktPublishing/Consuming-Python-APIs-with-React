import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Comp2 extends Component {
  render() {
    return (
      <div className="Comp2">
        <p>The value is {this.props.value}</p>
        <p>{this.props.title}</p>
        <p>{this.props.explanation}</p>
      </div>
    );
  }
  static propTypes = {
    value: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
  }
}

export default Comp2;
