import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Main from './Main.js';
import { editorMasks } from './Editor.js';
import ClientOAuth2  from 'client-oauth2';
import queryString from 'query-string'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alterId: null,
      selectedBookmarkId: null,
      data: [],
      bookmarkData: null,
      clientToken: {},
      editorState: 0,
      retrievedBookmarkData: false,
    }
  }
  componentWillMount() {
    const parsed = queryString.parse(window.location.search);
    this.processQueryString(parsed);
  }
  componentDidMount() {
    var serverAuth = new ClientOAuth2({
      clientId: 'vtHz5ojBPvqOuyAJq97OuhzUR8BlPKcsJDhxAmqB',
      clientSecret: 'iSXk2ts3cHCTnjUBfqksDT86ogyhKqRuWgYy96w82q15PK9xaGPZBoxbUCvKNpMReFea1P7tM0sT8ZvoXD0LWn5T2c6ZTAhs7IH0qwDnEcKKzkmO4aDi1Jjbw0V1W9A4',
      accessTokenUri: 'http://localhost:8000/locations/o/token/',
      redirectUri: 'http://localhost:8000/locations/bookmarks/',
      scopes: ['read', 'write']
    })
    serverAuth.owner.getToken('user', 'useruser')
      .then((inToken) => {
        this.setState({clientToken: inToken}, () => {
          this.getBookmarks();
        });
      })
      .catch((error) => {console.log('Token request error', error);});
  }
  createBookmarkStart() {
    // changes editor state to commence adding a bookmark
    let editorState = 0;
    editorState |= editorMasks.BOOKMARK;
    editorState |= editorMasks.ADDING;
    this.setState({editorState: editorState});
  }
  createCommentStart() {
    // changes editor state to commence adding a comment
    let editorState = 0;
    editorState |= editorMasks.COMMENT;
    editorState |= editorMasks.ADDING;
    this.setState({editorState: editorState});
  }
  createNoteStart() {
    // changes editor state to commence adding a note
    let editorState = 0;
    editorState |= editorMasks.NOTE;
    editorState |= editorMasks.ADDING;
    this.setState({editorState: editorState});
  }
  deleteBookmarkStart(id) {
    // changes editor state to commence deleting a bookmark
    let editorState = 0;
    editorState |= editorMasks.BOOKMARK;
    editorState |= editorMasks.DELETING;
    this.setState({editorState: editorState, alterId: id});
  }
  deleteCommentStart(id) {
    // changes editor state to commence deleting a bookmark
    let editorState = 0;
    editorState |= editorMasks.COMMENT;
    editorState |= editorMasks.DELETING;
    this.setState({editorState: editorState, alterId: id});
  }
  deleteNoteStart(id) {
    // changes editor state to commence deleting a bookmark
    let editorState = 0;
    editorState |= editorMasks.NOTE;
    editorState |= editorMasks.DELETING;
    this.setState({editorState: editorState, alterId: id});
  }
  editBookmarkStart(id) {
    // changes editor state to commence editing a bookmark
    let editorState = 0;
    editorState |= editorMasks.BOOKMARK;
    editorState |= editorMasks.AMENDING;
    this.setState({editorState: editorState, alterId: id});
  }
  editCommentStart(id) {
    // changes editor state to commence editing a note
    let editorState = 0;
    editorState |= editorMasks.COMMENT;
    editorState |= editorMasks.AMENDING;
    this.setState({editorState: editorState, alterId: id});
  }
  editNoteStart(id) {
    // changes editor state to commence editing a note
    let editorState = 0;
    editorState |= editorMasks.NOTE;
    editorState |= editorMasks.AMENDING;
    this.setState({editorState: editorState, alterId: id});
  }
  getBookmarks() {
    fetch(
      'http://localhost:8000/locations/bookmarks/',
      {
        method: "GET", mode: "cors", credentials: "omit",
        headers: {
          'Authorization': "Bearer " + this.state.clientToken.accessToken
        }
      }
    )
      .then(response => response.json())
      .then(responseData => this.setState({ data: responseData }))
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
     });
  }
  processQueryString(values) {
    // changes editor state to commence adding a bookmark, comment, or note
    // based on values array
    let editorState = 0;
    if ('add_bookmark' in values) {
      editorState |= editorMasks.BOOKMARK;
      editorState |= editorMasks.ADDING;
    }
    else if ('add_comment' in values) {
      editorState |= editorMasks.COMMENT;
      editorState |= editorMasks.ADDING;
    }
    else if ('add_note' in values) {
      editorState |= editorMasks.NOTE;
      editorState |= editorMasks.ADDING;
    }
    this.setState({editorState: editorState});
  }
  selectBookmark(id) {
    if (id === 0) {
      // clear Bookmark rather than select it
      this.setState({
        bookmarkData: null, retrievedBookmarkData: false,
        selectedBookmarkId: null,
      })
      return;
    }
    // Cannot fetch a bookmark until we have a token
    if (Object.keys(this.state.clientToken).length === 0) return;
    fetch(
      'http://localhost:8000/locations/bookmarks/' + id + '/',
      {
        method: "GET", mode: "cors", credentials: "omit",
        headers: {'Authorization': "Bearer " + this.state.clientToken.accessToken}
      }
    )
      .then((response) => {
        if (response.status === 404) throw 404;
        return response.json()
      })
      .then((responseData) => {
        return this.setState({
          bookmarkData: responseData, retrievedBookmarkData: true,
          selectedBookmarkId: responseData.id
        })
      })
      .catch((error) => {
        if (error !== 404)
          console.log('Error fetching and parsing bookmark instance data', error);
      });
  }
  stopEdit () {
    // changes state to stop editing
    this.setState({editorState: 0});
  }
  render() {
    return (
      <BrowserRouter><>
        <Route path="/" exact={true} render={(props) => {
          return (<Main {...props}
            addBookmarkStart={this.createBookmarkStart.bind(this)}
            addCommentStart={this.createCommentStart.bind(this)}
            addNoteStart={this.createNoteStart.bind(this)}
            alterId={this.state.alterId}
            clientToken={this.state.clientToken}
            bookmarkData={this.state.bookmarkData} data={this.state.data}
            deleteBookmarkStart={this.deleteBookmarkStart.bind(this)}
            deleteCommentStart={this.deleteCommentStart.bind(this)}
            deleteNoteStart={this.deleteNoteStart.bind(this)}
            editBookmarkStart={this.editBookmarkStart.bind(this)}
            editCommentStart={this.editCommentStart.bind(this)}
            editNoteStart={this.editNoteStart.bind(this)}
            editorState={this.state.editorState}
            getBookmarks={this.getBookmarks.bind(this)}
            selectClick={this.selectBookmark.bind(this)}
            selectedBookmarkId={this.state.selectedBookmarkId}
            stopEdit={this.stopEdit.bind(this)}
          />)
        }} />
        <Route path="/:id([0-9]+)" exact={true} render={(props) => {
          // get individual bookmark data if we have none now, or
          // the bookmark is different
          if (
              (this.state.bookmarkData === null) ||
              (this.state.bookmarkData !== null &&
              (parseInt(this.state.bookmarkData.id) !==
              parseInt( props.match.params.id)))) {
            this.selectBookmark(props.match.params.id);
          }
          return (<Main
            {...props}
            addBookmarkStart={this.createBookmarkStart.bind(this)}
            addCommentStart={this.createCommentStart.bind(this)}
            addNoteStart={this.createNoteStart.bind(this)}
            alterId={this.state.alterId}
            clientToken={this.state.clientToken}
            bookmarkData={this.state.bookmarkData} data={this.state.data}
            deleteBookmarkStart={this.deleteBookmarkStart.bind(this)}
            deleteCommentStart={this.deleteCommentStart.bind(this)}
            deleteNoteStart={this.deleteNoteStart.bind(this)}
            editBookmarkStart={this.editBookmarkStart.bind(this)}
            editCommentStart={this.editCommentStart.bind(this)}
            editNoteStart={this.editNoteStart.bind(this)}
            editorState={this.state.editorState}
            getBookmarks={this.getBookmarks.bind(this)}
            selectClick={this.selectBookmark.bind(this)}
            selectedBookmarkId={this.state.selectedBookmarkId}
            stopEdit={this.stopEdit.bind(this)}
          />)
        }} />
      </></BrowserRouter>
    );
  }
}
