import React, { Component } from 'react';
import RouterConfig from './RouterConfig';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <RouterConfig />
      </div>
    );
  }
}

export default App;
