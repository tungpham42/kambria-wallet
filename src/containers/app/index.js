import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

import Metamask from 'containers/metamask';
import Isoxys from 'containers/isoxys';

const margin = { marginRight: 1 + 'em' };

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Link style={margin} to="/metamask">Metamask</Link>
          <Link style={margin} to="/isoxys">Isoxys</Link>
        </header>
        <main>
          <Switch>
            <Redirect exact from="/" to="/metamask" />
            <Route exact path="/metamask" component={Metamask} />
            <Route exact path="/isoxys" component={Isoxys} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;