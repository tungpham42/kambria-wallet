import React, { Component } from 'react';
import ABI from './ABI.json';

import { Isoxys } from '@kambria/kambria-wallet';

const NETWORK = 'rinkeby';
const TYPE = 'softwallet';
const ACCOUNTS = TYPE === 'hardwallet' ?
  ['0x09e64b88cd3cb0b7aa2590477e1dd31ce3d508ec', '0x5a926B235e992d6BA52d98415E66aFe5078A1690'] :
  ['0x76d8B624eFDDd1e9fC4297F82a2689315ac62d82', '0x5a926B235e992d6BA52d98415E66aFe5078A1690'];
const TEST_DATA = {
  from: ACCOUNTS[0],
  to: ACCOUNTS[1],
  value: '1000000000000000'
}
const accOpts = {
  mnemonic: 'expand lake video put crowd pioneer slam mushroom damage middle column neutral',
  password: null,
  path: null,
  i: 0
}
// const accOpts = {
//   keystore: {"version":3,"id":"d01f6097-3db6-4d22-ba09-b7b251ded8cd","address":"76d8b624efddd1e9fc4297f82a2689315ac62d82","crypto":{"ciphertext":"4c5e75f03b42b2b0725f1947bc11309e609e77fc43aed7cfeae582ad0d67aa39","cipherparams":{"iv":"26ee2815b902aa8a14d2e772317ccabe"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"8be6b0db33659119737ecc8912de8f0296afdd6ddc9b336ad7856a62b47c3d40","n":262144,"r":8,"p":1},"mac":"00d21e647990dc4085983d332ed63bec6fcfd9e923b1d305a2412f396b9b08bd"}},
//   password: '123',
//   version: 3
// }

const getPassphrase = function (callback) {
  var passphrase = window.prompt('Please enter passphrase:');
  if (!passphrase) return callback('User denied signing transaction', null);
  return callback(null, passphrase)
}

const CONTRACT = {
  ADDRESS: '0x6c095bf240c7b9b445a51c44733e2a5126b613a2',
  ABI: ABI
}

class TestIsoxys extends Component {
  constructor() {
    super();

    var self = this;
    this.state = {
      ERROR: null,
      ADDRESS: null,
      BALANCE: 0,
      FIBONACCI: 0,
      TXID: 0
    }

    this.isoxys = new Isoxys(NETWORK, TYPE);

    this.isoxys.setAccountByMnemonic(accOpts.mnemonic, accOpts.password, null, 0, getPassphrase);
    // this.isoxys.setAccountByKeystore(accOpts.keystore, accOpts.password, accOpts.version, getPassphrase);
    // this.isoxys.setAccountByLedger();

    this.isoxys.web3.eth.getCoinbase(function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      self.setState({ ADDRESS: re })

      self.getBalance(re);
    });
    this.INSTANCE = this.isoxys.web3.eth.contract(CONTRACT.ABI).at(CONTRACT.ADDRESS);

    // Event listener
    this.INSTANCE.Next(function (er, re) {
      if (er) return self.setState({ ERROR: er.toString() });
      return self.setState({ FIBONACCI: re.args.b.toString() });
    });
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
    self.isoxys.web3.eth.sendTransaction(TEST_DATA, function (er, txId) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return self.setState({ TXID: txId.toString() });
    });
  }

  initFibonacci() {
    var self = this;
    self.INSTANCE.init(1, 2, { from: ACCOUNTS[0] }, function (er, txId) {
      if (er) return self.setState({ ERROR: JSON.stringify(er) });
      return self.setState({ TXID: txId.toString() });
    });
  }

  getFibonacci() {
    var self = this;
    self.INSTANCE.next({ from: ACCOUNTS[0] }, function (er, txId) {
      if (er) return self.setState({ ERROR: er.toString() });
      return self.setState({ TXID: txId.toString() });
    });
  }

  render() {
    return (
      <div>
        <h1>Isoxys testing</h1>
        <p>View console log for details</p>
        <p>Account: {this.state.ADDRESS}</p>
        <p>Balance: {this.state.BALANCE} wei</p>
        <p>Fibonacci: {this.state.FIBONACCI}</p>
        <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.TXID}>{this.state.TXID}</a></p>
        <button onClick={() => this.sendTx()}>Transfer</button>
        <button onClick={() => this.initFibonacci()}>initFibonacci</button>
        <button onClick={() => this.getFibonacci()}>getFibonacci</button>
        {this.state.ERROR ? <a >{this.state.ERROR}</a> : null}
      </div>
    );
  }
}

export default TestIsoxys;