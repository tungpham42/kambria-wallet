import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';


class TestWallet extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      provider: null,
      ACCOUNT: null,
      BALANCE: null,
      TXID: null,
      ERROR: null
    }

    this.register = this.register.bind(this);
    this.done = this.done.bind(this);
    this.sendTx = this.sendTx.bind(this);
  }

  register(force) {
    if (force) {
      this.setState({ visible: false }, function () {
        this.setState({ visible: true });
      });
    }
    else this.setState({ visible: true });
  }

  done(er, provider) {
    if (er) return console.error(er)

    var self = this;
    provider.web3.eth.getCoinbase(function (er, account) {
      if (er) return console.error(er);
      provider.web3.eth.getBalance(account, function (er, balance) {
        if (er) return console.error(er);
        self.setState({ ACCOUNT: account, BALANCE: Number(balance) });
      })
    });

    return this.setState({ provider: provider });
  }

  sendTx() {
    var self = this;
    var provider = this.state.provider;
    provider.web3.eth.sendTransaction({
      from: self.state.ACCOUNT,
      to: '0x5a926b235e992d6ba52d98415e66afe5078a1690',
      value: '1000000000000000'
    }, function (er, txId) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return self.setState({ TXID: txId.toString() });
    });
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={() => this.register(true)}>Register</button>

        <div>
          <p>Account: {this.state.ACCOUNT}</p>
          <p>Balance: {this.state.BALANCE}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.TXID}>{this.state.TXID}</a></p>
          <button onClick={this.sendTx}>Send Tx</button>
          {this.state.ERROR ? <a >{this.state.ERROR}</a> : null}
        </div>
        <Wallet visible={this.state.visible} net={4} done={this.done} />
      </div>
    );
  }
}

export default TestWallet;