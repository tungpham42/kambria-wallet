import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';


class TestWallet extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }

    this.visible = this.visible.bind(this);
    this.close = this.close.bind(this);
  }

  visible(force) {
    if (force) {
      this.setState({ visible: false }, () => {
        this.setState({ visible: true });
      });
    }
    else this.setState({ visible: true });
  }

  close() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={() => this.visible(true)}>Visible</button>
        <button onClick={() => this.close()}>Close</button>

        <Wallet visible={this.state.visible} net={4} done={(er, re) => { console.log(er, re) }} />
      </div>
    );
  }
}

export default TestWallet;