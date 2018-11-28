import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Grommet } from 'grommet';
import { grommetTheme } from './GrommetStyle.js';
import { BookmarksList } from './BookmarkList.js';
import { BookmarkDetail } from './BookmarkDetail.js';
import { Editor, editorMasks } from './Editor.js';

export default class Main extends Component {
  render () {
    let editorExistingItemData =
      ((this.props.editorState &
      (editorMasks.AMENDING | editorMasks.DELETING)) === 0) ? {} :
      this.props.bookmarkData;
    return (
      <Grommet theme={grommetTheme}>
        <Grid
          areas={[
            { name: 'main', start: [0, 0], end: [0, 0] },
            { name: 'detail', start: [1, 0], end: [1, 0] },
            { name: 'foot', start: [0, 1], end: [1, 1] },
          ]}
          columns={['medium', 'flex']}
          rows={['medium', 'small']}
          gap='small'
        >
          <Box
            gridArea='main' background='color-primary-0'
            overflow="scroll" pad="xxsmall"
          >
            <BookmarksList
              addBookmarkStart={this.props.addBookmarkStart}
              clientToken={this.props.clientToken}
              deleteBookmarkStart={this.props.deleteBookmarkStart}
              editBookmarkStart={this.props.editBookmarkStart}
              bookmarks={this.props.data}
              location={this.props.location} history={this.props.history}
              refreshThisBookmark={this.props.selectClick}
              selectClick={this.props.selectClick}
              selectedBookmark={this.props.bookmarkData}
            />
          </Box>
          <Box
            gridArea='detail' background='color-secondary-2-4'
            overflow="scroll" pad="xsmall"
          >
            <BookmarkDetail
              clientToken={this.props.clientToken}
              detail={this.props.bookmarkData}
              addNoteStart={this.props.addNoteStart}
              deleteNoteStart={this.props.deleteNoteStart}
              editNoteStart={this.props.editNoteStart}
              addCommentStart={this.props.addCommentStart}
              deleteCommentStart={this.props.deleteCommentStart}
              editCommentStart={this.props.editCommentStart}
              location={this.props.location} history={this.props.history}
            />
          </Box>
          <Box
            gridArea='foot' background='color-secondary-1-4'
            overflow="scroll" pad="xxsmall"
          >
            <Editor
              existingItemData={editorExistingItemData}
              state={this.props.editorState}
              stopEdit={this.props.stopEdit}
              clientToken={this.props.clientToken}
              itemId={this.props.alterId}
              refreshBookmarks={this.props.getBookmarks}
              refreshThisBookmark={this.props.selectClick}
              location={this.props.location} history={this.props.history}
              selectedBookmark={this.props.bookmarkData}
            />
          </Box>
        </Grid>
      </Grommet>
    )
  }
  static defaultProps = {
    alterId: null,
    selectedBookmarkId: null,
  }
  static propTypes = {
    addBookmarkStart: PropTypes.func.isRequired,
    addCommentStart: PropTypes.func.isRequired,
    addNoteStart: PropTypes.func.isRequired,
    alterId: PropTypes.number,
    bookmarkData: PropTypes.object,
    clientToken: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    deleteBookmarkStart: PropTypes.func.isRequired,
    deleteCommentStart: PropTypes.func.isRequired,
    deleteNoteStart: PropTypes.func.isRequired,
    editBookmarkStart: PropTypes.func.isRequired,
    editCommentStart: PropTypes.func.isRequired,
    editNoteStart: PropTypes.func.isRequired,
    editorState: PropTypes.number.isRequired,
    getBookmarks: PropTypes.func.isRequired,
    selectClick: PropTypes.func.isRequired,
    selectedBookmarkId: PropTypes.number,
    stopEdit: PropTypes.func.isRequired,
  }
}
