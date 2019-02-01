import React, { Component } from 'react';
import Modal from 'react-modal';

var Metamask = require('../metamask');
var Isoxys = require('../isoxys');

const ERROR = 'No address found';
const DEFAULT_HD_PATH = "m/44'/60'/0'/0";
const DEFAULT_VERSION = 3;

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
      limit: 10,
      page: 0
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onMore = this.onMore.bind(this);
    this.handle = this.handle.bind(this);
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
    if (this.props.data.wallet === 'metamask') {
      var metamask = new Metamask();
      this.done(null, { provider: metamask });
    }
    else if (this.props.data.wallet === 'isoxys') {
      var isoxys = new Isoxys(this.props.data.net, this.props.data.type);
      if (this.props.data.subType === 'mnemonic') {
        isoxys.setAccountByMnemonic(
          this.props.data.asset.mnemonic,
          this.props.data.asset.password,
          DEFAULT_HD_PATH,
          this.state.i,
          GET_PASSPHRASE
        );
        this.done(null, { provider: isoxys });
      }
      else if (this.props.data.subType === 'keystore') {
        isoxys.setAccountByKeystore(
          this.props.data.asset.keystore,
          this.props.data.asset.password,
          DEFAULT_VERSION,
          GET_PASSPHRASE
        )
      }
      else if (this.props.data.subType === 'ledger-nano-s') {

      }
      else if (this.props.data.subType === 'private-key') {
        isoxys.setAccountByPrivatekey(
          this.props.data.asset.privateKey,
          GET_PASSPHRASE
        )
      }
      else {
        return this.onClose(ERROR);
      }
    }
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
    this.getAddressByIsoxys(this.props.data, this.state.limit, this.state.page + 1).then(re => {
      var page = this.state.page + 1;
      var addressList = this.state.addressList;
      addressList.push(...re);
      this.setState({ page: page, addressList: addressList });
    }).catch(er => {
      if (er) return this.onClose(ERROR);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.handle(this.props.data);
      this.setState({ visible: this.props.visible });
    }
  }


  /**
   * Data controllers
   */

  handle(data) {
    if (data.wallet === 'metamask') {
      this.getAccountByMetamask().then(re => {
        this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else if (data.wallet === 'isoxys') {
      this.getAddressByIsoxys(data, this.state.limit, this.state.page).then(re => {
        this.setState({ addressList: re });
      }).catch(er => {
        if (er) return this.onClose(ERROR);
      });
    }
    else {
      return this.onClose(ERROR);
    }
  }

  getAccountByMetamask() {
    var metamask = new Metamask();
    return new Promise((resolve, reject) => {
      metamask.getAccount().then(re => {
        return resolve([re]);
      }).catch(er => {
        return reject(er);
      });
    });
  }

  getAddressByIsoxys(data, limit, page) {
    var isoxys = new Isoxys(data.net, data.type);

    return new Promise((resolve, reject) => {
      if (data.subType === 'mnemonic') {
        isoxys.getAccountsByMnemonic(
          data.asset.mnemonic,
          data.asset.password,
          DEFAULT_HD_PATH,
          limit,
          page,
          function (er, re) {
            if (er || re.length <= 0) return reject(ERROR);
            return resolve(re);
          });
      }
      else if (data.subType === 'keystore') {
        isoxys.getAccountByKeystore(
          data.asset.keystore,
          data.asset.password,
          DEFAULT_VERSION,
          function (er, re) {
            if (er || !re) return reject(ERROR);
            return resolve([re]);
          });
      }
      else if (data.subType === 'ledger-nano-s') {

      }
      else if (data.subType === 'private-key') {
        isoxys.getAccountByPrivatekey(
          data.asset.privateKey,
          function (er, re) {
            if (er || !re) return reject(ERROR);
            return resolve([re]);
          });
      }
      else {
        return reject(ERROR);
      }
    });
  }

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