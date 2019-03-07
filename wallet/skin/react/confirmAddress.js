import React, { Component } from 'react';
import Modal from './core/modal';
import { Button } from './core/buttons';

var Metamask = require('../../lib/metamask');
var Isoxys = require('../../lib/isoxys');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const ERROR = 'No address found';
const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const LIMIT = 5, PAGE = 0;

const DEFAULT_STATE = {
  addressList: [],
  selectedAddress: null,
  i: 0,
  limit: LIMIT,
  page: PAGE,
  loading: false
}



class ConfirmAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onMore = this.onMore.bind(this);
    this.getAddress = this.getAddress.bind(this);
    this.moreBtn = this.moreBtn.bind(this);
  }

  /**
   * UI controllers
   */

  onClose(er) {
    this.setState({ visible: false });
    this.done(er, null);
  }

  onConfirm() {
    this.setState({ visible: false });

    // Confirm Metmask address
    if (this.props.data.wallet === 'metamask') {
      var metamask = this.setAddressByMetamask();
      this.done(null, { provider: metamask });
    }
    // Confirm Isoxys address
    else if (this.props.data.wallet === 'isoxys') {
      var self = this;
      this.setAddressByIsoxys(this.props.data, this.state.i).then(isoxys => {
        self.done(null, { provider: isoxys });
      }).catch(er => {
        self.done(er, null);
      });
    }
    // Error occurs
    else {
      this.onClose(ERROR);
    }

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  onSelect(index, address) {
    this.setState({
      selectedAddress: address,
      i: index
    });
  }

  onMore() {
    this.setState({ loading: true }, function () {
      var page = this.state.page + 1;
      this.getAddressByIsoxys(this.props.data, this.state.limit, page).then(re => {
        var addressList = this.state.addressList;
        addressList.push(...re);
        this.setState({ page: page, addressList: addressList });
      }).catch(er => {
        if (er) this.onClose(ERROR);
      }).finally(() => {
        return this.setState({ loading: false });
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) this.getAddress(this.props.data);
      this.setState({ visible: this.props.visible });
    }
  }


  /**
   * Data controllers
   */
  getAddress(data) {
    if (data.wallet === 'metamask') {
      this.getAddressByMetamask().then(re => {
        return this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else if (data.wallet === 'isoxys') {
      this.getAddressByIsoxys(data, this.state.limit, this.state.page).then(re => {
        return this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else {
      return this.onClose(ERROR);
    }
  }

  /**
   * Wallet conventions
   */
  getAddressByMetamask() {
    var metamask = new Metamask();
    return new Promise((resolve, reject) => {
      metamask.getAccount().then(re => {
        return resolve([re]);
      }).catch(er => {
        return reject(er);
      });
    });
  }

  setAddressByMetamask() {
    var metamask = new Metamask();
    return metamask;
  }

  getAddressByIsoxys(data, limit, page) {
    var isoxys = new Isoxys(data.net, data.type);

    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.getAccountsByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return isoxys.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.getAccountsByLedger(
            DEFAULT_HD_PATH,
            limit,
            page,
            function (er, re) {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Private key
        case 'private-key':
          return isoxys.getAccountByPrivatekey(
            data.asset.privateKey,
            function (er, re) {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  setAddressByIsoxys(data, i) {
    var isoxys = new Isoxys(data.net, data.type);

    return new Promise((resolve, reject) => {
      switch (data.subType) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.setAccountByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            DEFAULT_HD_PATH,
            i,
            window.GET_PASSPHRASE,
            function () {
              return resolve(isoxys);
            });
        // Keystore
        case 'keystore':
          return isoxys.setAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            window.GET_PASSPHRASE,
            function () {
              return resolve(isoxys);
            });
        // Ledger Nano S
        case 'ledger-nano-s':
          return isoxys.setAccountByLedger(
            DEFAULT_HD_PATH,
            i,
            function () {
              return resolve(isoxys);
            });
        // Private key
        case 'private-key':
          return isoxys.setAccountByPrivatekey(
            data.asset.privateKey,
            window.GET_PASSPHRASE,
            function () {
              return resolve(isoxys);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  // UI conventions
  showAddresses(defaultIndex, addressList) {
    var re = [];
    for (let i = 0; i < addressList.length; i++) {
      var item = (
        <label key={i} className={cx("radio-wrapper")}>{addressList[i]}
          <input type="radio" name="address" onChange={() => this.onSelect(i, addressList[i])} value={addressList[i]} checked={i === defaultIndex} />
          <span className={cx("checkmark")}></span>
        </label>
      );
      re.push(item);
    }
    return re;
  }

  moreBtn() {
    var btn = <Button type="primary-gray" size="sm" onClick={this.onMore}
    >Load More</Button>
    if (this.props.data.subType === 'mnemonic') return btn;
    if (this.props.data.subType === 'ledger-nano-s') return btn;
    return null;
  }

  render() {
    return (
      <Modal className={cx("wallet-modal", "choose-wallet-address")}
        visible={this.state.visible}
        onClickBackdrop={() => this.onClose()}
        dialogClassName={cx("modal-dialog-centered")}>

        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={() => this.onClose()} />
          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ "color": "#13CDAC", "fontSize": "24px" }}>Choose Your Wallet Address</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px" }}>Choose a wallet to access fully functional features</p>

          {
            (!this.state.addressList || this.state.addressList.length <= 0 || this.state.loading) ?
              <div className={cx("d-block", "text-center", "mb-4")}>
                Loading address...
              </div>
              : null
          }

          {
            (!this.state.addressList || this.state.addressList.length <= 0) ?
              null :
              <div className={cx("addresses")}>
                {this.showAddresses(this.state.i, this.state.addressList)}
                {this.moreBtn()}
              </div>
          }

          <Button
            type="primary"
            size="sm"
            customStyle={{ "display": "block", "margin": "8px auto 0" }}
            onClick={this.onConfirm}
          >Confirm</Button>
        </div>

      </Modal>
    );
  }
}

export default ConfirmAddress;