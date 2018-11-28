import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from 'grommet';
import queryString from 'query-string'

class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedComment: null,
    }
  }
  render () {
    if (this.props.comments.length > 0) {
      return(
        <div>Comments:<br />
          <ul>
            {this.props.comments.map(
              (comment) => <Comment
                key={comment.id} id={comment.id} text={comment.text}
                time={comment.time}
                bookmarkDetail={this.props.bookmarkDetail}
                clientToken={this.props.clientToken}
                deleteCommentStart={this.props.deleteCommentStart}
                editCommentStart={this.props.editCommentStart}
                location={this.props.location} history={this.props.history}
                selectComment={this.selectComment.bind(this)}
                selectedComment={this.state.selectedComment}
              />
            )}
          </ul>
          <CommentAddButton
            userClick={this.props.addCommentStart}
            location={this.props.location} history={this.props.history}
          />
        </div>
      )
    }
    else {
      return (<>
        <p>There are no comments made on this bookmark</p>
        <CommentAddButton
          userClick={this.props.addCommentStart}
          location={this.props.location} history={this.props.history}
        />
      </>)
    }
  }
  selectComment(id) {
    this.setState({selectedComment: id})
  }
  static propTypes = {
    addCommentStart: PropTypes.func.isRequired,
    bookmarkDetail: PropTypes.object.isRequired,
    clientToken: PropTypes.object.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object),
    deleteCommentStart: PropTypes.func.isRequired,
    editCommentStart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }
}


class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numLikes: null,
    }
  }
  handleDeleteClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['delete_comment'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.deleteCommentStart(this.props.id);
  }
  handleEditClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['edit_comment'] = this.props.id
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.editCommentStart(this.props.id);
  }
  handleLikeClick(event) {
    this.props.history.push('/');
    let url = 'http://localhost:8000/locations/comments/' +
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
          this.props.refreshThisBookmark(this.bookmarkDetail.id);
        }
      })
      .catch((error) => {console.log('Error deleting bookmark', error);});

  }
  handleSelectClick(event) {
    this.props.selectComment(this.props.id);
    // Fetch comment detail to obtain the number of likes on this comment
    fetch(
      'http://localhost:8000/locations/comments/' + this.props.id + '/',
      {
        method: "GET", mode: "cors", credentials: "omit",
        headers: {'Authorization': "Bearer " + this.props.clientToken.accessToken}
      }
    )
      .then(response => {return response.json()})
      .then((responseData) => {
        return this.setState({numLikes: responseData.num_likes})
      })
      .catch((error) => {
          console.log('Error fetching and parsing comment instance data', error);
      });
  }
  render () {
    let thisCommentSelected = false;
    if ((this.props.selectedComment !== null) &&
        (this.props.selectedComment === this.props.id)) {
      thisCommentSelected = true;
    }
    let numLikesText = ''
    if (this.state.numLikes !== null) {
      numLikesText = 'Number of likes: ' + this.state.numLikes;
    }
    return(
      <li onClick={this.handleSelectClick.bind(this)}>
        <div>
          Comment id: {this.props.id}<br />{this.props.text}
          <br />Time: {this.props.time}
          {(this.state.numLikes === null) ? '' : <br />}
          {numLikesText}
        </div>
        {(!(thisCommentSelected)) ? '':
          <Grid
            areas={[
              { name: 'edit', start: [0, 0], end: [0, 0] },
              { name: 'delete', start: [1, 0], end: [1, 0] },
              { name: 'like', start: [2, 0], end: [2, 0] },
            ]}
            columns={['xsmall', 'xsmall', 'xsmall']}
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
  static propTypes = {
    bookmarkDetail: PropTypes.object.isRequired,
    clientToken: PropTypes.object.isRequired,
    deleteCommentStart: PropTypes.func.isRequired,
    editCommentStart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    selectComment: PropTypes.func.isRequired,
    selectedComment: PropTypes.number,
  }
}

class CommentAddButton extends Component {
  handleClick(event) {
    let queryStringValues = queryString.parse(this.props.location.search);
    queryStringValues['add_comment'] = ''
    let newLocation = this.props.location.pathname + '?' +
      queryString.stringify(queryStringValues);
    this.props.history.push(newLocation);
    this.props.userClick();
  }
  render () {
    return (
      <Button alignSelf="center" margin="small" plain={false}
        onClick={this.handleClick.bind(this)} >
          New comment
      </Button>
    )
  }
  static propTypes = {
    userClick: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }
}

export { CommentsList };
