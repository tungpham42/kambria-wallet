import React, { Component } from 'react';
import SellectWallet from './react/sellectWallet';
import InputAsset from './react/inputAsset';
import ConfirmAddress from './react/confirmAddress';
import Modal from 'react-modal';

const ERROR = 'User denied to register';

/**
 * For modals
 */
Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
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
      provider: null
    }

    this.done = this.props.done;
    this.doneSellectWallet = this.doneSellectWallet.bind(this);
    this.doneInputAsset = this.doneInputAsset.bind(this);
    this.doneConfirmAddress = this.doneConfirmAddress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.setState({
          step: 'SellectWallet',
          wallet: null,
          type: null,
          provider: null
        });
      }
      else {
        this.setState({
          step: null,
          wallet: null,
          type: null,
          provider: null
        });
      }
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
    if (er || !re) return this.setState({ step: 'StopRegister' });

    this.setState({ provider: re.provider });
  }

  render() {
    console.log('DEBUG:', this.state)
    return (
      <div>
        <SellectWallet visible={this.state.step === 'SellectWallet'} data={this.state} done={this.doneSellectWallet} style={customStyles} />
        <InputAsset visible={this.state.step === 'InputAsset'} data={this.state} done={this.doneInputAsset} style={customStyles} />
        <ConfirmAddress visible={this.state.step === 'ConfirmAddress'} data={this.state} done={this.doneConfirmAddress} style={customStyles} />
      </div>
    )
  }

}

export default Wallet; 