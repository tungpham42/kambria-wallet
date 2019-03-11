# Introduction

This module is a build-in zero client node as Metamask. It's supporting most of basic functions 
such as account management, transacion, contract, ...  With some restrictions of browser, the module will serve fully functions in Chrome and partly in the other browsers.

In **VERSION 2.x.x** module start to support React beside build-in zero clients.

## Install

```
npm install --save @kambria/kambria-wallet
```

# For using

## Prequisitions (In case, you want to install web3 by yourself)

* Install web3: ***Must be 0.20.x verison.***

```
npm install web3@0.20.6
```

## Utility

Component <Wallet /> has 3 props:

* visible: `true/false` to toogle the register modal.
* net: chaincode [(Chaincode detail)](https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids).
* done: callback function returns the provider when register had done.

Basic use:

```
import Wallet from '@kambria/kambria-wallet';

// ... Something React here

render() {
  <Wallet visible={visible} net={chaincode} done={callback} />
}
```

Advance use:

```
import { Metamask, Isoxys } from '@kambria/kambria-wallet';

// Recommend to view Example 2
```

## Examples 1

```
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
      from: this.state.ACCOUNT,
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
```

## Examples 2

```
import React, { Component } from 'react';
import {Metamask, Isoxys} from '@kambria/kambria-wallet';

const NETWORK = 'rinkeby';
const TYPE = 'softwallet';

const accOpts = {
  mnemonic: 'expand lake',
  password: null,
  path: "m/44'/60'/0'/0",
  i: 0,
  passphrase: 'p@ssphr@se'
}

class TestIsoxys extends Component {
  constructor() {
    super();

    var self = this;
    this.state = {
      ERROR: null,
      ADDRESS: null,
      BALANCE: 0,
      TXID: 0
    }

    this.isoxys = new Isoxys(NETWORK, TYPE, true);

    this.isoxys.setAccountByMnemonic(accOpts.mnemonic, accOpts.password, null, 0, accOpts.passphrase);

    this.isoxys.web3.eth.getCoinbase(function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      self.setState({ ADDRESS: re })

      self.getBalance(re);
    });
  }

  confirmUser(callback) {
    var passphrase = window.prompt('Please enter passphrase:');
    if (!passphrase) return console.error('User denied signing transaction');
    this.isoxys.provider.unlockAccount(passphrase);
    return callback();
  }

  getBalance(address) {
    var self = this;
    this.isoxys.web3.eth.getBalance(address, function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      return self.setState({ BALANCE: re.toString() });
    });
  }

  sendTx() {
    var self = this;
    this.confirmUser(function () {
      self.isoxys.web3.eth.sendTransaction(
        {
          from: self.state.ADDRESS,
          to: '0x0',
          value: 1000000000000000
        }, function (er, txId) {
        if (er) return self.setState({ ERROR: JSON.stringify(er) });
        return self.setState({ TXID: txId.toString() });
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Isoxys testing</h1>
        <p>View console log for details</p>
        <p>Account: {this.state.ADDRESS}</p>
        <p>Balance: {this.state.BALANCE} wei</p>
        <p>Tx id: {this.state.TXID}</p>
        <button onClick={() => this.sendTx()}>Transfer</button>
        {this.state.ERROR ? <p>{this.state.ERROR}</p> : null}
      </div>
    );
  }
}

export default TestIsoxys;
```

# For Dev

## The structure

The `wallet` folder contains the main source code. It has 2 sub-folders namely `lib` and `skin`, `lib` contains source code of the zero clients, `skin` contains source code of React.

The `src` folder contains test files. However, it can be viewed as an example, so
to know how to use them, you can refer to `src/*` for details.

## How to build library?

```
npm run build
```

The `index.js` file would be the destination of compiling (only one file).

## How to test?

### Unit test

```
Not yet
```

### Tool test

```
npm start
```

The app will be run on port 5000 with https and support hot-loading. (If the browser asks something, please trust it and process straight forward)


## Cheatsheet

| # | Commands | Descriptions |
| :-: | - | - |
| 1 | `npm install` | Install module packages |
| 2 | `npm run build` | Build libraries in production|
| 3 | `npm start` | Run tool test |