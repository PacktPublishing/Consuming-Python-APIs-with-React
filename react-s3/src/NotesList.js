import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from 'grommet';
import queryString from 'query-string'

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNote: null,
    }
  }
  render () {
    if (this.props.notes.length > 0) {
      return(
        <div>Notes:<br />
          <ul>
            {this.props.notes.map(
              (note) => <Note
                key={note.id} id={note.id} text={note.text} time={note.time}
                deleteNoteStart={this.props.deleteNoteStart}
                editNoteStart={this.props.editNoteStart}
                location={this.props.location} history={this.props.history}
                selectNote={this.selectNote.bind(this)}
                selectedNote={this.state.selectedNote}
              />
            )}
          </ul>
          <NoteAddButton
            userClick={this.props.addNoteStart}
            location={this.props.location} history={this.props.history}
          />
        </div>
      )
    }
    else {
      return (<>
        <p>There are no notes made on this bookmark</p>
        <NoteAddButton
          userClick={this.props.addNoteStart}
          location={this.props.location} history={this.props.history}
        />
      </>)
    }
  }
  selectNote(id) {
    this.setState({selectedNote: id})
  }
  static propTypes = {
    addNoteStart: PropTypes.func.isRequired,
    deleteNoteStart: PropTypes.func.isRequired,
    editNoteStart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object),
  }
}

class Note extends Component {
  handleDeleteClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['delete_note'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.deleteNoteStart(this.props.id);
  }
  handleEditClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['edit_note'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.editNoteStart(this.props.id);
  }
  handleSelectClick(event) {
    this.props.selectNote(this.props.id);
  }
  render () {
    let thisNoteSelected = false;
    if ((this.props.selectedNote !== null) &&
        (this.props.selectedNote === this.props.id)) {
      thisNoteSelected = true;
    }
    return(
      <li onClick={this.handleSelectClick.bind(this)}>
        <div>
          Note id: {this.props.id}<br />{this.props.text}<br />
          Time: {this.props.time}
        </div>
        {(!(thisNoteSelected)) ? '':
          <Grid
            areas={[
              { name: 'edit', start: [0, 0], end: [0, 0] },
              { name: 'delete', start: [1, 0], end: [1, 0] },
            ]}
            columns={['xsmall', 'xsmall']}
            rows={['xxsmall']}
            gap='small'
          >
            <Box gridArea='edit'>
              <Button alignSelf="center" margin="small" plain={false}
                onClick={this.handleEditClick.bind(this)} >
                Edit
              </Button>
            </Box>
            <Box gridArea='delete'>
              <Button alignSelf="center" margin="small" plain={false}
                onClick={this.handleDeleteClick.bind(this)} >
                Delete
              </Button>
            </Box>
          </Grid>
        }
      </li>
    )
  }
  static defaultProps = {
    selectedNote: null,
  }
  static propTypes = {
    deleteNoteStart: PropTypes.func.isRequired,
    editNoteStart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    selectNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.number,
  }
}

class NoteAddButton extends Component {
  handleClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['add_note'] = ''
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.userClick();
  }
  render () {
    return (
      <Button alignSelf="center" margin="small" plain={false}
        onClick={this.handleClick.bind(this)} >
          New note
      </Button>
    )
  }
  static propTypes = {
    userClick: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }
}

export { NotesList };
