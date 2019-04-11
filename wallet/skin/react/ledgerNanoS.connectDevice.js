import React, { Component } from 'react';
import { Button } from './core/buttons';
import Loading from './core/loading';
var Isoxys = require('../../lib/isoxys');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connect the devide and click the button!',
  TEST: 'Connecting',
  FAIL: 'Cannot connect the devide!'
}


class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT
    }

    this.checkTheConnection = this.checkTheConnection.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  checkTheConnection() {
    var self = this;
    this.setState({ message: STATUS.TEST });
    // Fetch the first address to know whether devide connected
    var isoxys = new Isoxys(null /** Use default for testing */, 'hardWallet', true);
    isoxys.getAccountsByLedger("m/44'/60'/0'", 1, 0, function (er, re) {
      if (er || re.lenght <= 0) return self.setState({ message: STATUS.FAIL });

      return self.returnData2Parent();
    });
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
        <p className={cx("type", "recommended")}>This is a recommended way to access your wallet.</p>
        <p></p>

        <div>
          <span className={cx("label", "mt-3", "d-block")}>
            {this.state.message}
            {this.state.message === STATUS.TEST ? <Loading /> : null}
          </span>
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