import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

import Metamask from 'containers/metamask';
import Provider from 'containers/provider';

const margin = { marginRight: 1 + 'em' };

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Link style={margin} to="/metamask">Metamask</Link>
          <Link style={margin} to="/provider">Provider</Link>
        </header>
        <main>
          <Switch>
            <Redirect exact from="/" to="/metamask" />
            <Route exact path="/metamask" component={Metamask} />
            <Route exact path="/provider" component={Provider} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;