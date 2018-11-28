import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommentsList } from './CommentsList.js';
import { NotesList } from './NotesList.js';

class BookmarkDetail extends Component {
  render() {
    return (
      <div className="bookmark_detail">
        {(this.props.detail === null) ? '' : <BookmarkDetailOverview
          url={this.props.detail.link} numLikes={this.props.detail.num_likes}
        />}
        {(this.props.detail == null) ? '' :
          <CommentsList
            addCommentStart={this.props.addCommentStart}
            bookmarkDetail={this.props.detail}
            clientToken={this.props.clientToken}
            comments={this.props.detail.comments}
            deleteCommentStart={this.props.deleteCommentStart}
            editCommentStart={this.props.editCommentStart}
            location={this.props.location} history={this.props.history}
          />
        }
        {(this.props.detail == null) ? '' :
          <NotesList
            addNoteStart={this.props.addNoteStart}
            deleteNoteStart={this.props.deleteNoteStart}
            editNoteStart={this.props.editNoteStart}
            location={this.props.location} history={this.props.history}
            notes={this.props.detail.notes}
          />
        }
      </div>
    )
  }
  static defaultProps = {
    detail: null,
  }
  static propTypes = {
    addNoteStart: PropTypes.func.isRequired,
    clientToken: PropTypes.object.isRequired,
    deleteNoteStart: PropTypes.func.isRequired,
    editNoteStart: PropTypes.func.isRequired,
    addCommentStart: PropTypes.func.isRequired,
    deleteCommentStart: PropTypes.func.isRequired,
    editCommentStart: PropTypes.func.isRequired,
    detail: PropTypes.object,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }
}

class BookmarkDetailOverview extends Component {
  render () {
    return (
      <p>
        Url: {this.props.url}<br /> Number of likes: {this.props.numLikes}
      </p>
    )
  }
  static propTypes = {
    url: PropTypes.string.isRequired,
    numLikes: PropTypes.number.isRequired,
  }
}

export { BookmarkDetail };
