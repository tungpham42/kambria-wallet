import React, { Component } from 'react';
import Modal from 'react-modal';

var Metamask = require('../metamask');
var Isoxys = require('../isoxys');

const ERROR = 'No address found';
const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const LIMIT = 5, PAGE = 0;

const GET_PASSPHRASE = function (callback) {
  var passphrase = window.prompt('Please enter passphrase:');
  if (!passphrase) return callback('User denied signing transaction', null);
  return callback(null, passphrase)
}


class ConfirmAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      addressList: [],
      selectedAddress: null,
      i: 0,
      limit: LIMIT,
      page: PAGE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
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

  onClickBackdrop() {
    this.setState({ visible: false });
    this.done(ERROR, null);
  }

  onConfirm() {
    this.setState({ visible: false });

    // Confirm Metmask address
    if (this.props.data.wallet === 'metamask') {
      var metamask = this.setAddressByMetamask();
      return this.done(null, { provider: metamask });
    }
    // Confirm Isoxys address
    else if (this.props.data.wallet === 'isoxys') {
      var isoxys = this.setAddressByIsoxys(this.props.data, this.state.i);
      return this.done(null, { provider: isoxys });
    }
    // Error occurs
    else {
      return this.onClose(ERROR);
    }
  }

  onSelect(e) {
    e.preventDefault();
    this.setState({
      selectedAddress: e.target.value,
      i: this.state.addressList.indexOf(e.target.value)
    });
  }

  onMore() {
    var page = this.state.page + 1;
    this.getAddressByIsoxys(this.props.data, this.state.limit, page).then(re => {
      var addressList = this.state.addressList;
      addressList.push(...re);
      this.setState({ page: page, addressList: addressList });
    }).catch(er => {
      if (er) return this.onClose(ERROR);
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

    switch (data.subType) {
      // Mnemonic
      case 'mnemonic':
        isoxys.setAccountByMnemonic(
          data.asset.mnemonic,
          data.asset.password,
          DEFAULT_HD_PATH,
          i,
          GET_PASSPHRASE
        );
        return isoxys;
      // Keystore
      case 'keystore':
        isoxys.setAccountByKeystore(
          data.asset.keystore,
          data.asset.password,
          GET_PASSPHRASE
        );
        return isoxys;
      // Ledger Nano S
      case 'ledger-nano-s':
        isoxys.setAccountByLedger(
          DEFAULT_HD_PATH,
          i
        );
        return isoxys;
      // Private key
      case 'private-key':
        isoxys.setAccountByPrivatekey(
          data.asset.privateKey,
          GET_PASSPHRASE
        );
        return isoxys;
      // Error
      default:
        return null;
    }
  }

  // UI conventions
  showAddresses(addressList) {
    var re = [];
    for (var i = 0; i < addressList.length; i++) {
      var item = (<option key={i} value={addressList[i]}>{addressList[i]}</option>);
      re.push(item);
    }
    return (<select
      defaultChecked={addressList[0]}
      size={addressList.length}
      value={this.state.selectedAddress}
      onChange={this.onSelect} >
      {re} </select>);
  }

  moreBtn() {
    var btn = <button onClick={this.onMore}>More</button>
    if (this.props.data.subType === 'mnemonic') return btn;
    if (this.props.data.subType === 'ledger-nano-s') return btn;
    return null;
  }

  render() {
    return (
      <Modal
        isOpen={this.state.visible}
        onRequestClose={this.onClickBackdrop}
        style={this.props.style}
      >
        <h2>ConfirmAddress</h2>
        <button onClick={this.onClose}>x</button>
        <div>
          <p>Confirm address:</p>
          {this.showAddresses(this.state.addressList)}
          {this.moreBtn()}
        </div>
        <button onClick={this.onConfirm}>Confirm</button>
      </Modal>
    );
  }
}

export default ConfirmAddress;