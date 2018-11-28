import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormField, TextInput } from 'grommet';

class SimpleTextInput extends Component {
  state = { value: "" };
  ref = React.createRef();
  onChange = event => {this.setState(
    { value: event.target.value },
    () => {
      if (this.props.stateCallback !== undefined) {
        this.props.stateCallback(this.props.name, this.state.value);
      }
    }
  );}
  componentWillMount() {
    this.setState({value: this.props.value})
  }
  render() {
    const { value } = this.state;
    return (
      <FormField label={this.props.label} htmlFor={this.props.id}>
        <TextInput
          id={this.props.id} name={this.props.name}
          value={value} onChange={this.onChange}
        />
      </FormField>
    );
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    stateCallback: PropTypes.func,
    value: PropTypes.string.isRequired,
  }
  static defaultProps = {
    placeholder: '',
    value: '',
    stateCallback: undefined,
  }
}

export { SimpleTextInput };
