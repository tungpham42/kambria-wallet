import React, { Component } from 'react';
import SellectWallet from './react/sellectWallet';
import InputAsset from './react/inputAsset';
import ConfirmAddress from './react/confirmAddress';
import InputPassphrase from './react/inputPassphrase';

const ERROR = 'User denied to register';
const DEFAULT_STATE = {
  step: null,
  wallet: null,
  type: null,
  subType: null,
  provider: null,
  asset: null,
  passphrase: false
}


class Wallet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      net: this.props.net ? this.props.net : 1, // mainnet as default
      step: this.props.visible ? 'SellectWallet' : null,
      wallet: null, // null, metamask, isoxys
      type: null, // softwallet, hardwallet
      subType: null, // null, mnemonic, keystore, ledger-nano-s, private-key
      provider: null,
      passphrase: false
    }

    this.done = this.props.done;
    this.doneSellectWallet = this.doneSellectWallet.bind(this);
    this.doneInputAsset = this.doneInputAsset.bind(this);
    this.doneConfirmAddress = this.doneConfirmAddress.bind(this);

    var self = this;
    window.GET_PASSPHRASE = function (callback) {
      self.setState({
        passphrase: <InputPassphrase visible={true} done={callback} />
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
    if (er || !re) return this.setState({ step: 'StopRegister' });

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
      this.setState({ step: 'StopRegister' });
    }
  }

  doneInputAsset(er, re) {
    if (er || !re) return this.setState({ step: 'StopRegister' });

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
      this.setState({ step: 'StopRegister' });
    }
  }

  doneConfirmAddress(er, re) {
    console.log(er, re)
    if (er || !re) this.done(ERROR, null);
    else this.done(null, re.provider);
    return this.setState(DEFAULT_STATE);
  }

  render() {
    console.log('DEBUG:', this.state)
    return (
      <div>
        <SellectWallet visible={this.state.step === 'SellectWallet' && !this.state.passphrase} data={this.state} done={this.doneSellectWallet} />
        <InputAsset visible={this.state.step === 'InputAsset' && !this.state.passphrase} data={this.state} done={this.doneInputAsset} />
        <ConfirmAddress visible={this.state.step === 'ConfirmAddress' && !this.state.passphrase} data={this.state} done={this.doneConfirmAddress} />
        {this.state.passphrase}
      </div>
    )
  }

}

export default Wallet; 