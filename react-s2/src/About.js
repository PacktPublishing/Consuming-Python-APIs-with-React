import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class About extends Component {
  render() {
    return (
      <div className="App flex-container">
        <div className="About">
          <p>This is about page</p>
          <p><Link to="/">Go to the home page</Link></p>
        </div>
      </div>
    )
  }
}

export default About;
