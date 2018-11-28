import React from 'react';
import PropTypes from 'prop-types';
import { EditorBase } from './EditorBases.js';
import { EditorBookmark } from './EditorBookmark.js';
import { EditorComment } from './EditorComment.js';
import { EditorNote } from './EditorNote.js';
import queryString from 'query-string'

const editorMasks = {
  BOOKMARK: 1,
  COMMENT: 1 << 1,
  NOTE: 1 << 2,
  ADDING: 1 << 3,
  AMENDING: 1 << 4,
  DELETING: 1 << 5,
};

class Editor extends EditorBase {
  constructor(props) {
    super(props);
    // this.state is the value of input fields which is distinct
    // from this.props.state which is editor configuration
    this.state = {}
  }
  render () {
    const adding = ((this.props.state & editorMasks.ADDING) !== 0);
    const amending = ((this.props.state & editorMasks.AMENDING) !== 0);
    const deleting = ((this.props.state & editorMasks.DELETING) !== 0);
    const blankrender = !(adding || amending || deleting);
    if (blankrender) return '';
    else if ((this.props.state & editorMasks.BOOKMARK) !== 0)
      return (
        <EditorBookmark
          clientToken={this.props.clientToken}
          editorValues={this.state}
          existingItemData={this.props.existingItemData}
          history={this.props.history} location={this.props.location}
          isAdding={adding} isEditing={amending} isDeleting={deleting}
          itemId={this.props.itemId}
          refreshBookmarks={this.props.refreshBookmarks}
          refreshThisBookmark={this.props.refreshThisBookmark}
          stopEdit={this.stopEdit.bind(this)}
          updateValues={this.updateValues.bind(this)}
        />
      )
    else if ((this.props.state & editorMasks.NOTE) !== 0)
      return (
        <EditorNote
          clientToken={this.props.clientToken}
          editorValues={this.state}
          existingItemData={this.props.existingItemData}
          history={this.props.history} location={this.props.location}
          isAdding={adding} isEditing={amending} isDeleting={deleting}
          itemId={this.props.itemId}
          refreshThisBookmark={this.props.refreshThisBookmark}
          selectedBookmark={this.props.selectedBookmark}
          stopEdit={this.stopEdit.bind(this)}
          updateValues={this.updateValues.bind(this)}
        />
      )
    else if ((this.props.state & editorMasks.COMMENT) !== 0)
      return (
        <EditorComment
          clientToken={this.props.clientToken}
          editorValues={this.state}
          existingItemData={this.props.existingItemData}
          history={this.props.history} location={this.props.location}
          isAdding={adding} isEditing={amending} isDeleting={deleting}
          itemId={this.props.itemId}
          refreshThisBookmark={this.props.refreshThisBookmark}
          selectedBookmark={this.props.selectedBookmark}
          stopEdit={this.stopEdit.bind(this)}
          updateValues={this.updateValues.bind(this)}
        />
      )
    return (
      <div className="editor">{(blankrender) ? '' : <p>Editor</p>}</div>
    )
  }
  stopEdit() {
    // remove any add_bookmark, add_comment, add_note , edit_x and delete_x from queryString
    let values = queryString.parse(this.props.location.search);
    delete values['add_bookmark'];
    delete values['add_comment'];
    delete values['add_note'];
    delete values['edit_bookmark'];
    delete values['edit_comment'];
    delete values['edit_note'];
    delete values['delete_bookmark'];
    delete values['delete_comment'];
    delete values['delete_note'];
    const newLocation = this.props.location.pathname + '?' + queryString.stringify(values);
    this.props.history.push(newLocation);
    this.props.stopEdit();
  }
  updateValues(key, value) {
    let updateObj = this.state;
    updateObj[key] = value;
    this.setState(updateObj);
  }
  static defaultProps = {
    existingItemData: {},
    state: 0,
    itemId: null,
    location: {},
    refreshBookmarks: undefined,
  }
  static propTypes = {
    clientToken: PropTypes.object.isRequired,
    existingItemData: PropTypes.object,
    history: PropTypes.object.isRequired,
    itemId: PropTypes.number,
    location: PropTypes.object.isRequired,
    refreshBookmarks: PropTypes.func,
    refreshThisBookmark: PropTypes.func,
    state: PropTypes.number.isRequired,
    selectedBookmark: PropTypes.object, // used for comments and notes and existing bookmarks
    stopEdit: PropTypes.func.isRequired,
  }
}

export { Editor, editorMasks };
