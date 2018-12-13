import React, { Component } from 'react';

import Provider from 'dist/provider';

const NETWORK = 'rinkeby';
const ACCOUNTS = ['0x76d8B624eFDDd1e9fC4297F82a2689315ac62d82', '0x5a926B235e992d6BA52d98415E66aFe5078A1690'];
const TEST_DATA = {
  from: ACCOUNTS[0],
  to: ACCOUNTS[1],
  value: '1000000000000000'
}
const accOpts = {
  address: ACCOUNTS[0],
  privateKey: '785E634D1A7FEBD45841DB2D3037600C6985174FB555EF92B168BC5F1A38A5D5',
  passphrase: '123'
}

const CONTRACT = {
  ADDRESS: '0x5030ca85dec163b102c84071655bed169b1eed94',
  ABI: [{ "constant": true, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "add", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }]
}

class TestProvider extends Component {
  constructor() {
    super();

    var self = this;
    this.state = {
      ERROR: null,
      ADDRESS: null,
      BALANCE: 0,
      ADD: 0
    }

    this.provider = new Provider(NETWORK, accOpts);
    this.provider.web3.eth.getCoinbase(function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      self.setState({ ADDRESS: re })

      self.getBalance(re);
    });
    this.INSTANCE = this.provider.web3.eth.contract(CONTRACT.ABI).at(CONTRACT.ADDRESS);
    this.INSTANCE.add(1, 2, { from: ACCOUNTS[0] }, function (er, re) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return self.setState({ ADD: re.toString() });
    });
  }

  confirmUser(txParams) {
    var passphrase = window.prompt(`From ${txParams.from} to ${txParams.to} value ${txParams.value}. Please enter passphrase:`);
    this.provider.setPassphrase(passphrase);
    this.sendTx();
  }

  sendTx() {
    var self = this;
    this.provider.web3.eth.sendTransaction(TEST_DATA, function (er, re) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return console.log(re);
    });
  }

  getBalance(address) {
    var self = this;
    this.provider.web3.eth.getBalance(address, function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      return self.setState({ BALANCE: re.toString() });
    });
  }

  render() {
    return (
      <div>
        <h1>Provider testing</h1>
        <p>View console log for details</p>
        <p>Account: {this.state.ADDRESS}</p>
        <p>Balance: {this.state.BALANCE} wei</p>
        <p>Contract call: 1 + 2 = {this.state.ADD}</p>
        <button onClick={() => this.confirmUser(TEST_DATA)}>Transfer</button>
        {this.state.ERROR ? <p>{this.state.ERROR}</p> : null}
      </div>
    );
  }
}

export default TestProvider;