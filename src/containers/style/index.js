import React, { Component } from 'react';

import Wallet from '@kambria/kambria-wallet';


class TestStyle extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <h1>Style testing</h1>
        <Wallet visible={this.state.visible} net={4} done={() => {/* null func */ }} />
      </div>
    );
  }
}

export default TestStyle;