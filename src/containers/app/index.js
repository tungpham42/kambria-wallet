import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

import Wallet from 'containers/wallet';
import Metamask from 'containers/metamask';
import Isoxys from 'containers/isoxys';
import Style from 'containers/style';

const margin = { marginRight: 1 + 'em' };

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Link style={margin} to='/wallet'>Wallet</Link>
          <Link style={margin} to='/metamask'>Metamask</Link>
          <Link style={margin} to='/isoxys'>Isoxys</Link>
          <Link style={margin} to='/isoxys'>Style</Link>
        </header>
        <main>
          <Switch>
            <Redirect exact from='/' to='/wallet' />
            <Route exact path='/wallet' component={Wallet} />
            <Route exact path='/metamask' component={Metamask} />
            <Route exact path='/isoxys ' component={Isoxys} />
            <Route exact path='/style ' component={Style} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;