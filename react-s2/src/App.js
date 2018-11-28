import React, { Component } from 'react';
import { Grommet } from 'grommet';
import Main from './Main.js';
import About from './About.js';
import { BrowserRouter, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter><div>
        <Route exact path="/" render={
          props => <Main {...props} initialValue={12} />
        }/>
        <Route exact path="/about" component={About} />
      </div></BrowserRouter>
    );
  }
}

export default App;
