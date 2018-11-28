import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from 'grommet';
import { SimpleTextInput } from './SimpleTextInput.js';
import { EditorSubBase } from './EditorBases.js';

class EditorNote extends EditorSubBase {
  constructor(props) {
    super(props);
    this.state = {
      note: {},
    }
  }
  findNote(notes, id) {
    for (var i=0; i < notes.length; i++) {
      if (notes[i].id === id) {
        return notes[i];
      }
    }
  }
  render() {
    var initNoteValue = ''
    if (this.props.isEditing || this.props.isDeleting) {
      this.state.note = this.findNote(
        this.props.existingItemData.notes,
        this.props.itemId,
      )
      initNoteValue = this.state.note.text;
    }
    if (this.props.isAdding || this.props.isEditing) {
      return (
        <Grid
          areas={[
            { name: 'note', start: [0, 0], end: [0, 0] },
            { name: 'submit', start: [1, 0], end: [1, 0] },
          ]}
          columns={['medium', 'small']}
          rows={['xsmall']}
          gap='small'
        >
          <Box gridArea='note'>
            <SimpleTextInput
              id='note-input' ref='note-input' label='Note detail' name='text'
              value={initNoteValue}
              stateCallback={this.updateValues.bind(this)}
            />
          </Box>
          <Box gridArea='submit'>
            <Button active={true} alignSelf="start" margin="xsmall" plain={false}
              onClick={this.submit.bind(this)} >
              {(this.props.isAdding) ? 'Create' : 'Update'}
            </Button>
            <Button active={true} alignSelf="start" margin="xsmall" plain={false}
              onClick={this.cancel.bind(this)} >
              Cancel
            </Button>
          </Box>
        </Grid>
      )
    }
    else {
      // deleting
      return (
        <Grid
          areas={[
            { name: 'text', start: [0, 0], end: [1, 0] },
            { name: 'submit', start: [0, 1], end: [0, 1] },
            { name: 'cancel', start: [1, 1], end: [1, 1] },
          ]}
          columns={['small', 'small']}
          rows={['xxsmall', 'xxsmall']}
          gap='xxsmall'
        >
          <Box gridArea='text'>
            Do you wish to delete Note with content {initNoteValue}?
          </Box>
          <Box gridArea='submit'>
            <Button active={true} alignSelf="start" margin="xsmall" plain={false}
              onClick={this.submit.bind(this)} >
              Delete
            </Button>
          </Box>
          <Box gridArea='cancel'>
            <Button active={true} alignSelf="start" margin="xsmall" plain={false}
              onClick={this.cancel.bind(this)} >
              Cancel
            </Button>
          </Box>
        </Grid>
      )
    }
  }
  submitAdding() {
    let newNoteValues = JSON.parse(JSON.stringify(this.props.editorValues));
    // bookmark id
    newNoteValues['bookmark'] = this.props.selectedBookmark.url;
    fetch(
      'http://localhost:8000/locations/notes/',
      {
        method: "POST", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
        body: JSON.stringify(newNoteValues),
      }
    )
      .then(() => {
        if (this.props.refreshThisBookmark !== undefined) {
          this.props.refreshThisBookmark(this.props.selectedBookmark.id);
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error creating new note', error);});
  }
  submitUpdating() {
    let updateValues = JSON.parse(JSON.stringify(this.props.editorValues));
    updateValues['id'] = this.state.note.id;
    updateValues['bookmark'] = this.props.existingItemData.url;
    let url = 'http://localhost:8000/locations/notes/' +
      this.state.note.id + '/';
    fetch(
      url,
      {
        method: "PUT", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
        body: JSON.stringify(updateValues),
      }
    )
      .then(() => {
        if (this.props.refreshThisBookmark !== undefined) {
          this.props.refreshThisBookmark(this.props.existingItemData.id);
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error updating note', error);});

  }
  submitDeleting() {
    this.props.history.push('/');
    let url = 'http://localhost:8000/locations/notes/' +
      this.props.itemId + '/';
    fetch(
      url,
      {
        method: "DELETE", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
      }
    )
      .then(() => {
        this.props.stopEdit();
        if (this.props.refreshThisBookmark !== undefined) {
          // refresh the bookmark
          this.props.refreshThisBookmark(this.props.existingItemData.id);
        }
      })
      .catch((error) => {console.log('Error deleting bookmark', error);});
  }
  static defaultProps = {
    data: {},
    itemId: 0,
    refreshBookmarks: undefined,
  }
  static propTypes = {
    clientToken: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editorValues: PropTypes.object.isRequired,
    existingItemData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isAdding: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    refreshThisBookmark: PropTypes.func,
    selectedBookmark: PropTypes.object.isRequired,
    stopEdit: PropTypes.func.isRequired,
    updateValues: PropTypes.func.isRequired,
  }
}

export { EditorNote };
