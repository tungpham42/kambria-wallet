import React, { Component } from 'react';
import { Button } from './core/buttons';
import Modal from './core/modal';

var Metamask = require('../../lib/metamask');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


class SellectWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.data = this.props.data;
    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onMetamask = this.onMetamask.bind(this);
    this.onIsoxys = this.onIsoxys.bind(this);
  }

  onClose(er) {
    this.setState({ visible: false });
    this.done(er, null);
  }

  onMetamask(type) {
    this.setState({ visible: false });
    var self = this;
    var metamask = new Metamask(this.data.net, type, true);
    metamask.setAccountByMetamask(function (er, re) {
      if (er) return self.done(er, null);

      self.done(null, {
        wallet: 'metamask',
        type: type,
        provider: metamask
      });
    });
  }

  onIsoxys(type) {
    this.setState({ visible: false });
    this.done(null, { wallet: 'isoxys', type: type });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return (
      <Modal className={cx("wallet-modal", "choose-wallet")}
        visible={this.state.visible}
        onClickBackdrop={() => this.onClose()}
        dialogClassName={cx("modal-dialog-centered")}>

        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={() => this.onClose()} />
          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ "color": "#13CDAC", "fontSize": "24px" }}>Choose Your Wallet</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px" }}>Choose a wallet to access fully functional features</p>
          <div className={cx("wallets")}>
            <div className={cx("wallet", "metamask")}>
              <div className={cx("icon")}></div>
              <Button
                type="primary"
                size="sm"
                onClick={() => this.onMetamask('softwallet')}>Metamask</Button>
            </div>
            <div className={cx("vl")} style={{ "left": "257px" }}></div>
            <div className={cx("wallet", "hardware")}>
              <div className={cx("icon")}></div>
              <Button
                type="primary"
                size="sm"
                onClick={() => this.onIsoxys('hardwallet')}>Hardware Wallet</Button>
            </div>
            <div className={cx("vl")} style={{ "left": "454px" }}></div>
            <div className={cx("wallet", "software")}>
              <div className={cx("icon")}></div>
              <Button
                type="primary"
                size="sm"
                onClick={() => this.onIsoxys('softwallet')}>Software Wallet</Button>
            </div>
          </div>
          <p className={cx("d-block", "text-center", "mt-5", "mb-1")} style={{ "color": "#9B9B9B", "fontSize": "16px", "lineHeight": "18px" }}>Or skip to website with limited function</p>
          <Button
            type="gray"
            size="sm"
            customStyle={{ "display": "block", "margin": "8px auto 0" }}
            onClick={() => this.onClose()}>Skip To Website</Button>
        </div>

      </Modal>
    );
  }
}

export default SellectWallet;