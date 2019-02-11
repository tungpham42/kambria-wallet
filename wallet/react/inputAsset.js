import React, { Component } from 'react';
import Modal from 'react-modal';

import MnemonicAsset from './mnemonic.inputAsset';
import KeystoreAsset from './keystore.inputAsset';
import LedgerNanoSAsset from './ledgerNanoS.inputAsset';
import PrivateKeyAsset from './privateKey.inputAsset';

const ERROR = 'User denied to register';


class InputAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      subType: 'mnemonic'
    }

    this.data = this.props.data;
    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
    this.onChangeAsset = this.onChangeAsset.bind(this);
    this.onReceive = this.onReceive.bind(this);
  }

  onClose(er) {
    this.setState({ visible: false });
    this.done(er, null);
  }

  onClickBackdrop() {
    this.setState({ visible: false });
    this.done(ERROR, null);
  }

  onChangeAsset(subType) {
    this.setState({ subType: subType });
  }

  onReceive(data) {
    this.done(null, data);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.state.visible}
        onRequestClose={this.onClickBackdrop}
        style={this.props.style}
      >
        <h2>InputAsset</h2>
        <button onClick={this.onClose}>x</button>
        <div>
          <p>Please select your favour option:</p>
        </div>
        <button onClick={() => { this.onChangeAsset('mnemonic') }}>Mnemonic</button>
        <button onClick={() => { this.onChangeAsset('keystore') }}>Keystore</button>
        <button onClick={() => { this.onChangeAsset('ledger-nano-s') }}>Ledge Nano S</button>
        <button onClick={() => { this.onChangeAsset('private-key') }}>Private Key</button>

        <MnemonicAsset visible={this.state.subType === 'mnemonic'} done={this.onReceive} />
        <KeystoreAsset visible={this.state.subType === 'keystore'} done={this.onReceive} />
        <LedgerNanoSAsset visible={this.state.subType === 'ledger-nano-s'} done={this.onReceive} />
        <PrivateKeyAsset visible={this.state.subType === 'private-key'} done={this.onReceive} />

      </Modal>
    );
  }
}

export default InputAsset;