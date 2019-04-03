import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';
import { Token } from '@kambria/kambria-contract';


class TestWallet extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      provider: null,
      network: null,
      account: null,
      balance: null,
      txId: null,
      error: null
    }

    this.register = this.register.bind(this);
    this.done = this.done.bind(this);
    this.sendETH = this.sendETH.bind(this);
    this.sendKAT = this.sendKAT.bind(this);
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
    var self = this;
    if (er) return this.setState({ error: JSON.stringify(er) });

    window.kambria.wallet.provider.watch().then(watcher => {
      watcher.event.on('data', re => {
        return self.setState(re);
      });
      watcher.event.on('error', er => {
        return self.setState({ error: JSON.stringify(er) });
      });
    }).catch(er => {
      return self.setState({ error: JSON.stringify(er) });
    });

    return this.setState({ provider: provider });
  }

  sendETH() {
    var self = this;
    var provider = this.state.provider;
    provider.web3.eth.sendTransaction({
      from: self.state.account,
      to: self.state.account,
      value: '1000000000000000'
    }, function (er, txId) {
      if (er) return self.setState({ error: JSON.stringify(er) });
      return self.setState({ txId: txId.toString() });
    });
  }

  sendKAT() {
    var self = this;
    var provider = this.state.provider;
    var token = new Token('0x9dddff7752e1714c99edf940ae834f0d57d68546', provider.web3);
    token.transfer(self.state.account, '1000000000000000000').then(txId => {
      console.log(txId)
      return self.setState({ txId: txId.toString() });
    }).catch(er => {
      console.log(er)
      return self.setState({ error: JSON.stringify(er) });
    });
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={() => this.register(true)}>Register</button>

        <div>
          <p>Network: {this.state.network}</p>
          <p>Account: {this.state.account}</p>
          <p>Balance: {this.state.balance}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.txId}>{this.state.txId}</a></p>
          <button onClick={this.sendETH}>Send ETH</button>
          <button onClick={this.sendKAT}>Send KAT</button>
          {this.state.error ? <a >{this.state.error}</a> : null}
        </div>
        <Wallet visible={this.state.visible} net={4} done={this.done} />
      </div>
    );
  }
}

export default TestWallet;