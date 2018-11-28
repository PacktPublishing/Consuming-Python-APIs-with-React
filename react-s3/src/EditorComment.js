import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from 'grommet';
import { SimpleTextInput } from './SimpleTextInput.js';
import { EditorSubBase } from './EditorBases.js';

class EditorComment extends EditorSubBase {
  constructor(props) {
    super(props);
    this.state = {
      comment: {},
    }
  }
  findComment(comments, id) {
    for (var i=0; i < comments.length; i++) {
      if (comments[i].id === id) {
        return comments[i];
      }
    }
  }
  render() {
    var initCommentValue = ''
    if (this.props.isEditing || this.props.isDeleting) {
      this.state.comment = this.findComment(
        this.props.existingItemData.comments,
        this.props.itemId,
      )
      initCommentValue = this.state.comment.text;
    }
    if (this.props.isAdding || this.props.isEditing) {
      return (
        <Grid
          areas={[
            { name: 'comment', start: [0, 0], end: [0, 0] },
            { name: 'submit', start: [1, 0], end: [1, 0] },
          ]}
          columns={['medium', 'small']}
          rows={['xsmall']}
          gap='small'
        >
          <Box gridArea='comment'>
            <SimpleTextInput
              id='comment-input' ref='comment-input' label='Comment detail' name='text'
              value={initCommentValue}
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
            Do you wish to delete Comment with content {initCommentValue}?
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
    let newCommentValues = JSON.parse(JSON.stringify(this.props.editorValues));
    // bookmark id
    newCommentValues['bookmark'] = this.props.selectedBookmark.url;
    fetch(
      'http://localhost:8000/locations/comments/',
      {
        method: "POST", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
        body: JSON.stringify(newCommentValues),
      }
    )
      .then(() => {
        if (this.props.refreshThisBookmark !== undefined) {
          this.props.refreshThisBookmark(this.props.selectedBookmark.id);
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error creating new comment', error);});
  }
  submitUpdating() {
    let updateValues = JSON.parse(JSON.stringify(this.props.editorValues));
    updateValues['id'] = this.state.comment.id;
    updateValues['bookmark'] = this.props.existingItemData.url;
    let url = 'http://localhost:8000/locations/comments/' +
      this.state.comment.id + '/';
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
      .catch((error) => {console.log('Error updating comment', error);});

  }
  submitDeleting() {
    this.props.history.push('/');
    let url = 'http://localhost:8000/locations/comments/' +
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

export { EditorComment };
