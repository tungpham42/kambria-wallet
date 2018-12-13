var ethUtil = require('ethereumjs-util');
var ethTx = require('ethereumjs-tx')
var cryptoJS = require("crypto-js");
var aes = require("crypto-js").AES;
// var Engine = require('./engine');
var Zeroc = require('./zeroc');
var Store = require('./store');

class Provider {
  constructor(net, accOpts) {
    // var engine = new Engine(net, this.opts());
    var engine = new Zeroc(net, this.opts());
    this.store = new Store();
    this.setAccount(accOpts.address, accOpts.privateKey, accOpts.passphrase);

    this.web3 = engine.web3;
  }

  opts() {
    var self = this;
    return {
      dataHandler: function () { /* Turn off default logs */ },
      errorHandler: function () { /* Turn off default logs */ },
      getAccounts: function (callback) {
        var accounts = self.getAddress();
        return callback(null, accounts);
      },
      approveTransaction: function (txParams, callback) {
        var passphrase = self.getPassphrase();
        if (!passphrase) return callback('User denied signing the transaction.', null);
        return callback(null, passphrase);
      },
      signTransaction: function (txParams, callback) {
        var priv = self.unlockPrivateKey();
        if (!priv) return callback('Wrong passphrase.', null);
        var rawTx = new ethTx(txParams);
        rawTx.sign(Buffer.from(priv, 'hex'));
        var signedTx = '0x' + rawTx.serialize().toString('hex');
        return callback(null, signedTx);
      }
    }
  }

  setAccount(address, privateKey, passphrase) {
    address = address.toLowerCase();
    privateKey = privateKey.toLowerCase();
    if (!this.validatePrivateKey(address, privateKey)) {
      console.error('Invalid address or private key');
      return false;
    }
    var encryptedPriv = aes.encrypt(privateKey, passphrase).toString();
    this.store.set('ACCOUNT', {
      ADDRESS: address,
      PRIVATEKEY: encryptedPriv,
      PASSPHRASE: null
    });
    return true;
  }

  getAddress() {
    var acc = this.store.get('ACCOUNT');
    return [acc.ADDRESS];
  }

  unlockPrivateKey() {
    var acc = this.store.get('ACCOUNT');
    var priv = aes.decrypt(acc.PRIVATEKEY, acc.PASSPHRASE);
    if (!priv) return null;
    priv = priv.toString(cryptoJS.enc.Utf8);
    this.clearPassphrase();
    return priv;
  }

  validatePrivateKey(addr, priv) {
    priv = new Buffer(priv, 'hex');
    var valid = true;
    valid = valid && ethUtil.isValidPrivate(priv);
    var _addr = '0x' + ethUtil.privateToAddress(priv).toString('hex');
    valid = valid && (_addr === addr);
    return valid;
  }

  setPassphrase(passphrase) {
    var acc = this.store.get('ACCOUNT');
    acc.PASSPHRASE = passphrase;
    this.store.set('ACCOUNT', acc);
  }

  getPassphrase() {
    var acc = this.store.get('ACCOUNT');
    return acc.PASSPHRASE;
  }

  clearPassphrase() {
    var acc = this.store.get('ACCOUNT');
    acc.PASSPHRASE = null;
    this.store.set('ACCOUNT', acc);
  }
}

export default Provider;