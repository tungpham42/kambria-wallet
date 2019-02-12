import React, { Component } from 'react';
import { Button } from './core/buttons';
import Modal from 'react-bootstrap4-modal';

const ERROR = 'User denied to register';


class SellectWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.data = this.props.data;
    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
    this.onMetamask = this.onMetamask.bind(this);
    this.onIsoxys = this.onIsoxys.bind(this);
  }

  onClose(er) {
    er = er ? er : ERROR;
    this.setState({ visible: false });
    this.done(er, null);
  }

  onClickBackdrop() {
    this.setState({ visible: false });
    this.done(ERROR, null);
  }

  onMetamask() {
    this.setState({ visible: false });
    this.done(null, { wallet: 'metamask' });
  }

  onIsoxys() {
    this.setState({ visible: false });
    this.done(null, { wallet: 'isoxys' });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <Modal className="wallet-modal choose-wallet"
        visible={this.state.visible}
        onClickBackdrop={this.onClickBackdrop}
        dialogClassName="modal-dialog-centered">

        <div className="modal-body">
          <button type="button" className="close-button" onClick={this.onClose} />
          <span className="title d-block text-center mt-4" style={{ "color": "#13CDAC", "fontSize": "24px" }}>Choose Your Wallet</span>
          <p className="d-block text-center mb-4" style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px" }}>Choose a wallet to access fully functional features</p>
          <div className="wallets">
            <div className="wallet metamask">
              <div className="icon"></div>
              <Button
                type="primary"
                size="sm"
                onClick={this.onMetamask}>Use Metamask</Button>
            </div>
            <div className="vl"></div>
            <div className="wallet other">
              <div className="icon"></div>
              <Button
                type="primary"
                size="sm"
                onClick={this.onIsoxys}>Use Other Wallet</Button>
            </div>
          </div>
          <p className="d-block text-center mt-5 mb-1" style={{ "color": "#9B9B9B", "fontSize": "16px", "lineHeight": "18px" }}>Or skip to website with limited function</p>
          <Button
            type="gray"
            size="sm"
            customStyle={{ "display": "block", "margin": "8px auto 0" }}
            onClick={this.onClose}>Skip To Website</Button>
        </div>

      </Modal>
    );
  }
}

export default SellectWallet;