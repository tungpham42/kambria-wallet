import React, { Component } from 'react';
import SellectWallet from './skin/react/sellectWallet';
import InputAsset from './skin/react/inputAsset';
import ConfirmAddress from './skin/react/confirmAddress';
import InputPassphrase from './skin/react/inputPassphrase';
import ErrorModal from './skin/react/core/error';

import './skin/static/styles/index.css';

const DEFAULT_STATE = {
  step: null,
  wallet: null, // null, metamask, isoxys
  type: null, // softwallet, hardwallet
  subType: null, // null, mnemonic, keystore, ledger-nano-s, private-key
  provider: null,
  asset: null,
  error: '',
  passphrase: false,
  callback: null
}


class Wallet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      net: this.props.net ? this.props.net : 1, // mainnet as default
      ...DEFAULT_STATE
    }

    if (this.props.visible) this.setState({ step: 'SelectWallet' });

    this.done = this.props.done;
    this.doneSellectWallet = this.doneSellectWallet.bind(this);
    this.doneInputAsset = this.doneInputAsset.bind(this);
    this.doneConfirmAddress = this.doneConfirmAddress.bind(this);
    this.stop = this.stop.bind(this);

    var self = this;
    window.GET_PASSPHRASE = function (callback) {
      self.setState({ passphrase: false, callback: null }, function () {
        self.setState({ passphrase: true, callback: callback });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) this.setState({ step: 'SellectWallet' });
      else this.setState(DEFAULT_STATE);
    }
  }

  /**
   * Flow management
   */

  doneSellectWallet(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });
    if (!re) return this.stop();

    if (re.wallet === 'metamask') {
      this.setState({
        step: 'ConfirmAddress',
        wallet: 'metamask',
        type: 'softwallet'
      });
    }
    else if (re.wallet === 'isoxys') {
      this.setState({
        step: 'InputAsset',
        wallet: 'isoxys'
      });
    }
    else {
      return this.stop();
    }
  }

  doneInputAsset(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });
    if (!re) return this.stop();

    if (re.subType === 'mnemonic') {
      this.setState({
        step: 'ConfirmAddress',
        type: 'softwallet',
        subType: 'mnemonic',
        asset: re.asset
      });
    }
    else if (re.subType === 'keystore') {
      this.setState({
        step: 'ConfirmAddress',
        type: 'softwallet',
        subType: 'keystore',
        asset: re.asset
      });
    }
    else if (re.subType === 'ledger-nano-s') {
      this.setState({
        step: 'ConfirmAddress',
        type: 'hardwallet',
        subType: 'ledger-nano-s',
        asset: re.asset
      });
    }
    else if (re.subType === 'private-key') {
      this.setState({
        step: 'ConfirmAddress',
        type: 'softwallet',
        subType: 'private-key',
        asset: re.asset
      });
    }
    else {
      return this.stop();
    }
  }

  doneConfirmAddress(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });
    else if (!re) return this.stop();
    else this.done(null, re.provider);
    return this.setState(DEFAULT_STATE);
  }

  stop() {
    this.setState({ ...DEFAULT_STATE });
  }

  render() {
    return (
      <div>
        <SellectWallet visible={this.state.step === 'SellectWallet' && !this.state.passphrase} data={this.state} done={this.doneSellectWallet} />
        <InputAsset visible={this.state.step === 'InputAsset' && !this.state.passphrase} data={this.state} done={this.doneInputAsset} />
        <ConfirmAddress visible={this.state.step === 'ConfirmAddress' && !this.state.passphrase} data={this.state} done={this.doneConfirmAddress} />
        <InputPassphrase visible={this.state.passphrase} done={(er, re) => { this.state.callback(er, re) }} />
        <ErrorModal visible={this.state.step === 'Error'} error={this.state.error} done={() => { this.done(this.state.error, null) }} />
      </div>
    )
  }

}

export default Wallet; 