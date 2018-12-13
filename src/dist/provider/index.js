'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ethUtil = require('ethereumjs-util');
var ethTx = require('ethereumjs-tx');
var cryptoJS = require("crypto-js");
var aes = require("crypto-js").AES;
// var Engine = require('./engine');
var Zeroc = require('./zeroc');
var Store = require('./store');

var Provider = function () {
  function Provider(net, accOpts) {
    _classCallCheck(this, Provider);

    // var engine = new Engine(net, this.opts());
    var engine = new Zeroc(net, this.opts());
    this.store = new Store();
    this.setAccount(accOpts.address, accOpts.privateKey, accOpts.passphrase);

    this.web3 = engine.web3;
  }

  _createClass(Provider, [{
    key: 'opts',
    value: function opts() {
      var self = this;
      return {
        dataHandler: function dataHandler() {/* Turn off default logs */},
        errorHandler: function errorHandler() {/* Turn off default logs */},
        getAccounts: function getAccounts(callback) {
          var accounts = self.getAddress();
          return callback(null, accounts);
        },
        approveTransaction: function approveTransaction(txParams, callback) {
          var passphrase = self.getPassphrase();
          if (!passphrase) return callback('User denied signing the transaction.', null);
          return callback(null, passphrase);
        },
        signTransaction: function signTransaction(txParams, callback) {
          var priv = self.unlockPrivateKey();
          if (!priv) return callback('Wrong passphrase.', null);
          var rawTx = new ethTx(txParams);
          rawTx.sign(Buffer.from(priv, 'hex'));
          var signedTx = '0x' + rawTx.serialize().toString('hex');
          return callback(null, signedTx);
        }
      };
    }
  }, {
    key: 'setAccount',
    value: function setAccount(address, privateKey, passphrase) {
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
  }, {
    key: 'getAddress',
    value: function getAddress() {
      var acc = this.store.get('ACCOUNT');
      return [acc.ADDRESS];
    }
  }, {
    key: 'unlockPrivateKey',
    value: function unlockPrivateKey() {
      var acc = this.store.get('ACCOUNT');
      var priv = aes.decrypt(acc.PRIVATEKEY, acc.PASSPHRASE);
      if (!priv) return null;
      priv = priv.toString(cryptoJS.enc.Utf8);
      this.clearPassphrase();
      return priv;
    }
  }, {
    key: 'validatePrivateKey',
    value: function validatePrivateKey(addr, priv) {
      priv = new Buffer(priv, 'hex');
      var valid = true;
      valid = valid && ethUtil.isValidPrivate(priv);
      var _addr = '0x' + ethUtil.privateToAddress(priv).toString('hex');
      valid = valid && _addr === addr;
      return valid;
    }
  }, {
    key: 'setPassphrase',
    value: function setPassphrase(passphrase) {
      var acc = this.store.get('ACCOUNT');
      acc.PASSPHRASE = passphrase;
      this.store.set('ACCOUNT', acc);
    }
  }, {
    key: 'getPassphrase',
    value: function getPassphrase() {
      var acc = this.store.get('ACCOUNT');
      return acc.PASSPHRASE;
    }
  }, {
    key: 'clearPassphrase',
    value: function clearPassphrase() {
      var acc = this.store.get('ACCOUNT');
      acc.PASSPHRASE = null;
      this.store.set('ACCOUNT', acc);
    }
  }]);

  return Provider;
}();

exports.default = Provider;