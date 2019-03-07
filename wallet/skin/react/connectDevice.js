import React, { Component } from 'react';
import Modal from './core/modal';
import LedgerNanoSAsset from './ledgerNanoS.connectDevice';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const MENU = [
  { key: 'ledger-nano-s', label: 'Ledger' },
];


class ConnectDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      subType: 'ledger-nano-s'
    }

    this.data = this.props.data;

    this.onClose = this.onClose.bind(this);
    this.onChangeDevice = this.onChangeDevice.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.menu = this.menu.bind(this);
    this.device = this.device.bind(this);
  }

  onClose(er) {
    this.setState({ visible: false });
    this.props.done(er, null);
  }

  onChangeDevice(subType) {
    this.setState({ subType: subType });
  }

  onConnect(data) {
    this.props.done(null, data);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  menu() {
    var re = [];
    for (let i = 0; i < MENU.length; i++) {
      var item = null;
      if (this.state.subType === MENU[i].key) {
        item = <li className={cx("active")} key={i} onClick={() => this.onChangeDevice(MENU[i].key)}>{MENU[i].label}</li>
      }
      else {
        item = <li className={cx("prev")} key={i} onClick={() => this.onChangeDevice(MENU[i].key)}>{MENU[i].label}</li>
      }
      re.push(item);
    }
    return re;
  }

  device() {
    if (this.state.subType === 'ledger-nano-s') return <LedgerNanoSAsset done={this.onConnect} />
  }

  render() {
    return (
      <Modal className={cx("wallet-modal", "other-wallet")}
        visible={this.state.visible}
        onClickBackdrop={() => this.onClose()}
        dialogClassName={cx("modal-dialog-centered")}>

        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={() => this.onClose()} />
          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ "color": "#13CDAC", "fontSize": "24px" }}>Choose Your Wallet</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px" }}>Chose a wallet to access fully functional features</p>
          <ul className={cx("wallet-menu")}>
            {this.menu()}
          </ul>
          <div className={cx("wallet-content", "mb-5")}>
            {this.state.visible ? this.device() : null /* Tricky to clear history */}
          </div>
        </div>

      </Modal>
    );
  }
}

export default ConnectDevice;