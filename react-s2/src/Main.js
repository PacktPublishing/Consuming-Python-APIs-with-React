import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Comp1 from './Comp1.js';
import Comp2 from './Comp2.js';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue, title: "", explanation: "",
    }
  }
  async componentDidMount() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
      .then(response => response.json())
      .then(
        data =>
        this.setState({title: data.title, explanation: data.explanation})
      )
      .catch((error) => {console.log('Error fetching and parsing data', error);});
  }
  inc_value() {
    const newValue = this.state.value + 1;
    this.setState({value: newValue,});
  }
  render() {
    return (
      <div className="App flex-container">
        <Comp1 text="Click me" inc_value={this.inc_value.bind(this)}/>
        <Comp2
          value={this.state.value} title={this.state.title}
          explanation={this.state.explanation}
        />
      </div>
    );
  }
  static propTypes = {
    initialValue: PropTypes.number.isRequired,
  }
}

export default Main;
