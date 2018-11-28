import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Comp1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "Default",
    }
  }
  clicked_p() {
    this.props.inc_value();
  }
  render() {
    return (
      <div className="Comp1">
        <p onClick={this.clicked_p.bind(this)}>{this.props.text}</p>
        <p><input
          type="search" value={this.state.searchValue}
          onChange={this.searchChange.bind(this)}
        /></p>
        <p><Link to="/about">Go to about page</Link></p>
      </div>
    );
  }
  searchChange(event) {
    this.setState({searchValue: event.target.value});
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    inc_value: PropTypes.func.isRequired,
  }
}

export default Comp1;
