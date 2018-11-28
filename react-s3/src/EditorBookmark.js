import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from 'grommet';
import { SimpleTextInput } from './SimpleTextInput.js';
import { EditorSubBase } from './EditorBases.js';

class EditorBookmark extends EditorSubBase {
  render() {
    const initLinkValue = (this.props.isEditing || this.props.isDeleting) ?
      this.props.existingItemData.link : '';
    if (this.props.isAdding || this.props.isEditing) {
      return (
        <Grid
          areas={[
            { name: 'url', start: [0, 0], end: [0, 0] },
            { name: 'submit', start: [1, 0], end: [1, 0] },
          ]}
          columns={['medium', 'small']}
          rows={['large']}
          gap='small'
        >
          <Box gridArea='url'>
            <SimpleTextInput
              id='link-input' ref='link-input' label='Bookmark url' name='link'
              value={initLinkValue}
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
            Do you wish to delete Bookmark {initLinkValue}?
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
    fetch(
      'http://localhost:8000/locations/bookmarks/',
      {
        method: "POST", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
        body: JSON.stringify(this.props.editorValues),
      }
    )
      .then(() => {
        if (this.props.refreshBookmarks !== undefined) {
          this.props.refreshBookmarks();
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error creating new bookmark', error);});
  }
  submitUpdating() {
    let updateValues = this.props.editorValues;
    updateValues['id'] = this.props.existingItemData.id;
    let url = 'http://localhost:8000/locations/bookmarks/' +
      this.props.existingItemData.id + '/';
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
        if (this.props.refreshBookmarks !== undefined) {
          this.props.refreshBookmarks();
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error updating bookmark', error);});
  }
  submitDeleting() {
    this.props.history.push('/');
    let url = 'http://localhost:8000/locations/bookmarks/' +
      this.props.existingItemData.id + '/';
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
          // refresh the bookmark with 0 (clears it)
          this.props.refreshThisBookmark(0);
        }
        if (this.props.refreshBookmarks !== undefined) {
          this.props.refreshBookmarks();
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
    history: PropTypes.object.isRequired,
    isAdding: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    refreshBookmarks: PropTypes.func,
    refreshThisBookmark: PropTypes.func,
    stopEdit: PropTypes.func.isRequired,
    updateValues: PropTypes.func.isRequired,
  }
}

export { EditorBookmark };
