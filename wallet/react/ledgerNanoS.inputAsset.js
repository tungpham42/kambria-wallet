import React, { Component } from 'react';
var Isoxys = require('../isoxys');

var COUNTER;

class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      counter: 0,
      message: 'Please connect the devide and click the button.',
      isConnected: false
    }

    this.counter = this.counter.bind(this);
    this.checkTheConnection = this.checkTheConnection.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ counter: 0, message: 'connecting...' });
    this.counter();
    // Fetch the first address to know whether devide connected
    var isoxys = new Isoxys(null /** Use default for testing */, 'hardWallet');
    isoxys.getAccountsByLedger("m/44'/60'/0'", 1, 0, function (er, re) {
      if (er || re.lenght <= 0) {
        return self.setState({ isConnected: false, message: 'Cannot connect the devide.' });
      }
      return self.setState({ isConnected: true, message: 'Found a devide.' });
    });
  }

  counter() {
    var self = this;
    clearInterval(COUNTER);
    COUNTER = setInterval(function () {
      self.setState({ counter: self.state.counter + 1 });
    }, 1000);
  }

  returnData2Parent() {
    this.props.done({
      subType: 'ledger-nano-s'
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    if (!this.props.visible) return null;
    if (this.state.isConnected) this.returnData2Parent();
    return (
      <div>
        <p>Ledger Nano S</p>
        <p>{this.state.message} {this.state.counter ? <b>({this.state.counter}s)</b> : null}</p>
        {this.state.isConnected ? null : <button onClick={this.checkTheConnection}>Check the connection</button>}
      </div>
    )
  }
}

export default LedgerNanoSAsset;