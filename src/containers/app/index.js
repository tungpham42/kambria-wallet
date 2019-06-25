import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import Wallet from 'containers/wallet';

const margin = { marginRight: 1 + 'em' };

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <header>
            <Link style={margin} to='/wallet'>Wallet</Link>
          </header>
          <main>
            <Switch>
              <Redirect exact from='/' to='/wallet' />
              <Route exact path='/wallet' component={Wallet} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;