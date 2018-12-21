## Introduction

This module is a build-in zero client node as Metamask. It's supporting most of basic functions 
such as account management, transacion, contract, ...  With some restrictions of browser, the module will serve fully functions in Chrome and partly in the other browsers.

## Prerequisite

Install node modules

```
npm install
```

## The structure

The `wallet` folder contains the main source code.

The `src` folder contains test files. However, it can be viewed as an example, so
to know how to use them, you can refer to `src/*` for details.

## How to build library?

```
npm run build
```

## How to test?

### Unit test

```
Not yet
```

### UI test

```
npm test
```

The app will be run on port 5000 with https, if browser aks something, please trust it and process straight forward.

*Notice that it is not supported hot-reloading outside `/src`, so you should re-run `npm test` manually for any code chaging.*

## How to use for production?

### Prequisitions (In case, you want to install web3 by yourself)

* Install web3: ***Must be 0.20.x verison.***

```
npm install web3@0.20.6
```

* Build library (if the `dist` folder or `index.js` in root doesn't exist).
  
```
npm run build
```

### Utility

The `dist` folder contains all you need for creating your client node.

* Using the lib by:
```
import {Metamask, Kammask} from '@kambria/krambria-wallet';
```
Or copy that, put it somewhere in your project and import it to use. You can refer the examples in the `src` folder for the detail.


### Examples

```
import React, { Component } from 'react';

import {Metamask, Kammask} from '@kambria/kambria-wallet';

const NETWORK = 'rinkeby';
const TYPE = 'softwallet';

const accOpts = {
  mnemonic: 'expand lake',
  password: null,
  path: "m/44'/60'/0'/0",
  i: 0,
  passphrase: 'p@ssphr@se'
}

class TestKammask extends Component {
  constructor() {
    super();

    var self = this;
    this.state = {
      ERROR: null,
      ADDRESS: null,
      BALANCE: 0,
      TXID: 0
    }

    this.kammask = new Kammask(NETWORK, TYPE);

    this.kammask.setAccountByMnemonic(accOpts.mnemonic, accOpts.password, null, 0, accOpts.passphrase);

    this.kammask.web3.eth.getCoinbase(function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      self.setState({ ADDRESS: re })

      self.getBalance(re);
    });
  }

  confirmUser(callback) {
    var passphrase = window.prompt('Please enter passphrase:');
    if (!passphrase) return console.error('User denied signing transaction');
    this.kammask.provider.unlockAccount(passphrase);
    return callback();
  }

  getBalance(address) {
    var self = this;
    this.kammask.web3.eth.getBalance(address, function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      return self.setState({ BALANCE: re.toString() });
    });
  }

  sendTx() {
    var self = this;
    this.confirmUser(function () {
      self.kammask.web3.eth.sendTransaction(
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
        <h1>Kammask testing</h1>
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

export default TestKammask;
```

## Cheatsheet

| # | Commands | Descriptions |
| :-: | - | - |
| 1 | `npm install` | Install module packages |
| 2 | `npm run build` | Build javascript libraries |
| 3 | `npm test` | Run ui test |