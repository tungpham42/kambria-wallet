import React, { Component } from 'react';
import { Button } from './core/buttons';
var Isoxys = require('../../lib/isoxys');

var COUNTER = 0;
var TIMEOUT = 60;


class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      message: 'Please connect the devide and click the button.'
    }

    this.counter = this.counter.bind(this);
    this.checkTheConnection = this.checkTheConnection.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ counter: 1, message: 'Connecting...' });
    this.counter(function () {
      // In case no device connected
      self.setState({ counter: 0, message: 'Cannot connect the devide.' });
    });
    // Fetch the first address to know whether devide connected
    var isoxys = new Isoxys(null /** Use default for testing */, 'hardWallet');
    isoxys.getAccountsByLedger("m/44'/60'/0'", 1, 0, function (er, re) {
      if (er || re.lenght <= 0) {
        return self.setState({ counter: 0, message: 'Cannot connect the devide.' });
      }

      self.returnData2Parent();
      return self.setState({ counter: 0, message: 'Found a devide.' });
    });
  }

  counter(callback) {
    var self = this;
    clearInterval(COUNTER);
    COUNTER = null;
    COUNTER = setInterval(function () {
      if (self.state.counter >= 1) self.setState({ counter: self.state.counter + 1 });
      if (self.state.counter >= TIMEOUT) {
        clearInterval(COUNTER);
        COUNTER = null;
        return callback();
      }
    }, 1000);
  }

  returnData2Parent() {
    this.props.done({
      subType: 'ledger-nano-s'
    });
  }

  render() {
    return (
      <div>
        <h3>Ledger hardware</h3>
        <p className='type recommended'>This is a recommended way to access your wallet.</p>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

        <div>
          <span className="label mt-3 d-block">{this.state.message} {this.state.counter ? <b>({this.state.counter}s)</b> : null}</span>
        </div>

        <Button
          type="primary"
          size="sm"
          customStyle={{ "float": "right", "marginTop": "24px", "width": "170px" }}
          onClick={this.checkTheConnection}
        >Connect</Button>
      </div>
    )
  }
}

export default LedgerNanoSAsset;