import React, { Component } from 'react';
import SellectWallet from './skin/react/sellectWallet';
import InputAsset from './skin/react/inputAsset';
import ConnectDevice from './skin/react/connectDevice';
import ConfirmAddress from './skin/react/confirmAddress';
import InputPassphrase from './skin/react/inputPassphrase';
import ErrorModal from './skin/react/core/error';


const ERROR = 'Wallet is not supported.';
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
    this.doneConnectDevice = this.doneConnectDevice.bind(this);
    this.doneConfirmAddress = this.doneConfirmAddress.bind(this);
    this.end = this.end.bind(this);

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

    if (re.wallet === 'metamask') {
      return this.end(null, re);
    }
    else if (re.wallet === 'isoxys') {
      if (re.type == 'softwallet') {
        return this.setState({
          step: 'InputAsset',
          wallet: re.wallet,
          type: re.type
        });
      }
      else { // hardwallet
        return this.setState({
          step: 'ConnectDevice',
          wallet: re.wallet,
          type: re.type
        });
      }
    }
    else {
      return this.setState({ error: ERROR, step: 'Error' });
    }

  }

  doneInputAsset(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });

    if (re.subType === 'mnemonic') {
      this.setState({
        step: 'ConfirmAddress',
        subType: 'mnemonic',
        asset: re.asset
      });
    }
    else if (re.subType === 'keystore') {
      this.setState({
        step: 'ConfirmAddress',
        subType: 'keystore',
        asset: re.asset
      });
    }
    else if (re.subType === 'private-key') {
      this.setState({
        step: 'ConfirmAddress',
        subType: 'private-key',
        asset: re.asset
      });
    }
    else {
      return this.setState({ error: ERROR, step: 'Error' });
    }
  }

  doneConnectDevice(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });

    if (re.subType === 'ledger-nano-s') {
      this.setState({
        step: 'ConfirmAddress',
        subType: 'ledger-nano-s',
        asset: null
      });
    }
    else {
      this.setState({ error: ERROR, step: 'Error' });
    }
  }

  doneConfirmAddress(er, re) {
    if (er) return this.setState({ error: er, step: 'Error' });
    return this.end(null, re);
  }

  end(er, re) {
    if (er) this.done(er, null);
    else this.done(null, re.provider);
    return this.setState(DEFAULT_STATE);
  }

  render() {
    return (
      <div>
        <SellectWallet visible={this.state.step === 'SellectWallet' && !this.state.passphrase} data={this.state} done={this.doneSellectWallet} />
        <InputAsset visible={this.state.step === 'InputAsset' && !this.state.passphrase} data={this.state} done={this.doneInputAsset} />
        <ConnectDevice visible={this.state.step === 'ConnectDevice' && !this.state.passphrase} data={this.state} done={this.doneConnectDevice} />
        <ConfirmAddress visible={this.state.step === 'ConfirmAddress' && !this.state.passphrase} data={this.state} done={this.doneConfirmAddress} />
        <InputPassphrase visible={this.state.passphrase} done={(er, re) => { this.state.callback(er, re) }} />
        <ErrorModal visible={this.state.step === 'Error' && !this.state.passphrase} error={this.state.error} done={() => { this.end(this.state.error, null) }} />
      </div>
    )
  }

}

export default Wallet; 