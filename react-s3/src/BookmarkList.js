import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { Box, Button, Grid } from 'grommet';
import queryString from 'query-string'
import PropTypes from 'prop-types';

class BookmarksList extends Component {
  render () {
    return(
      <>
        <ul>
          {(this.props.bookmarks.length !== 0) ? this.props.bookmarks.map(
            (bookmark) => <Bookmark
              key={bookmark.id} id={bookmark.id} link={bookmark.link}
              clientToken={this.props.clientToken}
              deleteBookmarkStart={this.props.deleteBookmarkStart}
              editBookmarkStart={this.props.editBookmarkStart}
              location={this.props.location} history={this.props.history}
              refreshThisBookmark={this.props.refreshThisBookmark}
              selectClick={this.props.selectClick}
              selectedBookmark={this.props.selectedBookmark}
            />
          ) : ''}
        </ul>
        <BookmarkAddButton
          userClick={this.props.addBookmarkStart}
          location={this.props.location} history={this.props.history}
        />
      </>
    )
  }
  static defaultProps = {
    selectedBookmark: null,
  }
  static propTypes = {
    addBookmarkStart: PropTypes.func.isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.object),
    clientToken: PropTypes.object.isRequired,
    deleteBookmarkStart: PropTypes.func.isRequired,
    editBookmarkStart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    refreshThisBookmark: PropTypes.func,
    selectClick: PropTypes.func.isRequired,
    selectedBookmark: PropTypes.object,
  }
}


class Bookmark extends Component {
  handleDeleteClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['delete_bookmark'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.deleteBookmarkStart(this.props.id);
  }
  handleEditClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['edit_bookmark'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.editBookmarkStart(this.props.id);
  }
  handleLikeClick(event) {
    this.props.history.push('/');
    let url = 'http://localhost:8000/locations/bookmarks/' +
      this.props.id + '/add_like/';
    fetch(
      url,
      {
        method: "POST", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.props.clientToken.accessToken,
          'Content-Type': "application/json"
        },
      }
    )
      .then(() => {
        if (this.props.refreshThisBookmark !== undefined) {
          // refresh the bookmark
          this.props.refreshThisBookmark(this.props.id);
        }
        this.props.stopEdit();
      })
      .catch((error) => {console.log('Error deleting bookmark', error);});

  }
  render () {
    let bookmarkId = null;
    if (this.props.selectedBookmark !== null &&
        this.props.selectedBookmark.id !== undefined &&
        this.props.selectedBookmark.id === this.props.id)
      bookmarkId = this.props.selectedBookmark.id;
    return(
      <li>
        <Link to={"/" + this.props.id}>{this.props.link}</Link>
        {(bookmarkId === null) ? '':
          <Grid
            areas={[
              { name: 'edit', start: [0, 0], end: [0, 0] },
              { name: 'delete', start: [1, 0], end: [1, 0] },
              { name: 'like', start: [2, 0], end: [2, 0] },
            ]}
            columns={['xsmall', 'xsmall', 'xsmall']}
            rows={['xxsmall']}
            gap='xxsmall'
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
            <Box gridArea='like'>
              <Button alignSelf="center" margin="small" plain={false}
                onClick={this.handleLikeClick.bind(this)} >
                Like
              </Button>
            </Box>
          </Grid>
        }
      </li>
    )
  }
  static defaultProps = {
    selectedBookmark: null,
  }
  static propTypes = {
    clientToken: PropTypes.object.isRequired,
    deleteBookmarkStart: PropTypes.func.isRequired,
    editBookmarkStart: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    link: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    selectClick: PropTypes.func.isRequired,
    selectedBookmark: PropTypes.object,
  }
}


class BookmarkAddButton extends Component {
  handleClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['add_bookmark'] = ''
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.userClick();
  }
  render () {
    return (
      <Button alignSelf="center" margin="small" plain={false}
        onClick={this.handleClick.bind(this)} >
          New bookmark
      </Button>
    )
  }
  static propTypes = {
    userClick: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }
}

export { BookmarksList };
