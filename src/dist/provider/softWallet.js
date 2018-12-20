'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ethUtil = require('ethereumjs-util');
var cryptoJS = require('crypto-js');
var aes = cryptoJS.AES;
var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

var error = require('../error');

var SoftWallet = function () {
  /**
   * @constructor
   * @param {*} net - chainCode
   * @param {*} accOpts - accOpts = {
   *   address: ...
   *   privateKey: ...
   *   passphrase: ...
   * }
   */
  function SoftWallet(net, accOpts) {
    _classCallCheck(this, SoftWallet);

    accOpts = accOpts || {};
    this.network = util.chainCode(net);
    var engine = new Engine(this.network, this.opts());
    this.store = new Store();
    var ok = this.setAccount(accOpts.address, accOpts.privateKey, accOpts.passphrase);
    if (!ok) throw new Error(error.CANNOT_SET_ACCOUNT);
    this.web3 = engine.web3;
  }

  /**
   * @func opts
   * Define optional functions for engine
   */


  _createClass(SoftWallet, [{
    key: 'opts',
    value: function opts() {
      var self = this;
      return {
        dataHandler: function dataHandler() {/* Turn off default logs */},
        errorHandler: function errorHandler() {/* Turn off dÎefault logs */},
        getAccounts: function getAccounts(callback) {
          var accounts = self.getAddress();
          return callback(null, accounts);
        },
        approveTransaction: function approveTransaction(txParams, callback) {
          return callback(null, true);
        },
        signTransaction: function signTransaction(txParams, callback) {
          var passphrase = self.getPassphrase();
          if (!passphrase) return callback(error.CANNOT_UNLOCK_ACCOUNT, null);
          var priv = self._unlockAccount(passphrase);
          if (!priv) return callback(error.CANNOT_UNLOCK_ACCOUNT, null);
          var signedTx = util.signRawTx(txParams, priv);
          return callback(null, signedTx);
        }
      };
    }

    /**
     * @func setAccount
     * Set up coinbase
     * @param {*} address 
     * @param {*} privateKey 
     * @param {*} passphrase 
     */

  }, {
    key: 'setAccount',
    value: function setAccount(address, privateKey, passphrase) {
      if (!address || !privateKey || !passphrase) {
        console.error('Passphrase must be not null');
        return false;
      }
      address = address.toLowerCase();
      privateKey = privateKey.toLowerCase();
      passphrase = passphrase.toString();
      if (!this.validatePrivateKey(address, privateKey)) {
        console.error('Invalid address or private key');
        return false;
      }
      var salt = cryptoJS.lib.WordArray.random(128 / 8);
      var password = this.constructPassword(passphrase, salt);
      if (!password) {
        console.error('Cannot set up password');
        return false;
      }
      var encryptedPriv = aes.encrypt(privateKey, password).toString();
      this.store.set('ACCOUNT', {
        ADDRESS: address,
        PRIVATEKEY: encryptedPriv,
        PASSPHRASE: null,
        SALT: salt
      });
      return true;
    }

    /**
     * @func validatePrivateKey
     * Double check the pair of address/privatekey
     * @param {*} addr 
     * @param {*} priv 
     */

  }, {
    key: 'validatePrivateKey',
    value: function validatePrivateKey(addr, priv) {
      if (!addr || !priv) return false;
      priv = new Buffer(priv, 'hex');
      var valid = true;
      valid = valid && ethUtil.isValidPrivate(priv);
      var _addr = '0x' + ethUtil.privateToAddress(priv).toString('hex');
      valid = valid && _addr === addr;
      return valid;
    }

    /**
     * @func setPassphrase
     * To unlock account, user must set temporarily passphrase to store.
     * @param {*} passphrase 
     */

  }, {
    key: 'setPassphrase',
    value: function setPassphrase(passphrase) {
      var acc = this.store.get('ACCOUNT');
      acc.PASSPHRASE = passphrase;
      this.store.set('ACCOUNT', acc);
      return true;
    }

    /**
     * @func constructPassword
     * Construct password from passphrase and salt
     * @param {*} passphrase 
     * @param {*} salt 
     */

  }, {
    key: 'constructPassword',
    value: function constructPassword(passphrase, salt) {
      if (!passphrase || !salt) return null;
      var password = cryptoJS.PBKDF2(passphrase, salt, { keySize: 512 / 32, iterations: 1000 });
      return password.toString();
    }

    /**
     * @function unlockAccount
     * Public interface, that user can use to unlock account by inputing passphrase
     * @param {*} passphrase 
     */

  }, {
    key: 'unlockAccount',
    value: function unlockAccount(passphrase) {
      return this.setPassphrase(passphrase);
    }

    /**
     * @func _unlockAccount
     * Internal function, that acctually does unlocking acc.
     * @param {*} passphrase 
     */

  }, {
    key: '_unlockAccount',
    value: function _unlockAccount(passphrase) {
      var password = this.constructPassword(passphrase, this.getSalt());
      var enpriv = this.getPrivateKey();
      if (!password || !enpriv) return null;
      var priv = aes.decrypt(enpriv, password);
      if (!priv) return null;
      priv = priv.toString(cryptoJS.enc.Utf8);
      return priv;
    }

    /**
     * Functions for reading store
     */

  }, {
    key: 'getAddress',
    value: function getAddress() {
      var acc = this.store.get('ACCOUNT');
      if (!acc || (typeof acc === 'undefined' ? 'undefined' : _typeof(acc)) !== 'object') return [];
      return [acc.ADDRESS];
    }
  }, {
    key: 'getPassphrase',
    value: function getPassphrase() {
      var acc = this.store.get('ACCOUNT');
      if (!acc || (typeof acc === 'undefined' ? 'undefined' : _typeof(acc)) !== 'object') return null;
      var passphrase = acc.PASSPHRASE;
      // For safety, everytime unlock account had done, it must be clear passphrase.
      acc.PASSPHRASE = null;
      this.store.set('ACCOUNT', acc);
      return passphrase;
    }
  }, {
    key: 'getPrivateKey',
    value: function getPrivateKey() {
      var acc = this.store.get('ACCOUNT');
      if (!acc || (typeof acc === 'undefined' ? 'undefined' : _typeof(acc)) !== 'object') return null;
      return acc.PRIVATEKEY;
    }
  }, {
    key: 'getSalt',
    value: function getSalt() {
      var acc = this.store.get('ACCOUNT');
      if (!acc || (typeof acc === 'undefined' ? 'undefined' : _typeof(acc)) !== 'object') return null;
      return acc.SALT;
    }
  }]);

  return SoftWallet;
}();

module.exports = SoftWallet;