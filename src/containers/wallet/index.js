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

    this.visible = this.visible.bind(this);
    this.close = this.close.bind(this);
    this.done = this.done.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.sendTx = this.sendTx.bind(this);
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

  done(er, provider) {
    if (er) return this.setState({ error: er, provider: null });

    var self = this;
    provider.web3.eth.getCoinbase(function (er, account) {
      if (er) return console.log(er);
      provider.web3.eth.getBalance(account, function (er, balance) {
        if (er) return console.log(er);
        self.setState({ ACCOUNT: account, BALANCE: Number(balance) });
      })
    });

    return this.setState({ error: null, provider: provider });
  }

  sendTx() {
    var self = this;
    var provider = this.state.provider;
    provider.web3.eth.sendTransaction({
      from: this.state.ACCOUNT,
      to: '0x5a926b235e992d6ba52d98415e66afe5078a1690',
      value: '1000000000000000'
    }, function (er, txId) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return self.setState({ TXID: txId.toString() });
    });
  }

  showInfo() {
    var provider = this.state.provider;
    if (!provider) return null;
    return (
      <div>
        <p>Account: {this.state.ACCOUNT}</p>
        <p>Balance: {this.state.BALANCE}</p>
        <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.TXID}>{this.state.TXID}</a></p>
        <button onClick={this.sendTx}>Send Tx</button>
        {this.state.ERROR ? <a >{this.state.ERROR}</a> : null}
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={() => this.visible(true)}>Visible</button>
        <button onClick={() => this.close()}>Close</button>
        {this.showInfo()}

        <Wallet visible={this.state.visible} net={4} done={this.done} />
      </div>
    );
  }
}

export default TestWallet;