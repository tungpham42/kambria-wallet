var ethUtil = require('ethereumjs-util');
var cryptoJS = require('crypto-js');
var aes = cryptoJS.AES;
var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

const error = require('../error');

class SoftWallet {
  constructor(net, accOpts) {
    var engine = new Engine(net, this.opts());
    this.store = new Store();
    var ok = this.setAccount(accOpts.address, accOpts.privateKey, accOpts.passphrase);
    if (!ok) throw new Error(error.CANNOT_SET_ACCOUNT);
    this.web3 = engine.web3;
  }

  /**
   * @func opts
   * Define optional functions for engine
   */
  opts() {
    var self = this;
    return {
      dataHandler: function () { /* Turn off default logs */ },
      errorHandler: function () { /* Turn off dÎefault logs */ },
      getAccounts: function (callback) {
        var accounts = self.getAddress();
        return callback(null, accounts);
      },
      approveTransaction: function (txParams, callback) {
        return callback(null, true);
      },
      signTransaction: function (txParams, callback) {
        var passphrase = self.getPassphrase();
        if (!passphrase) return callback('User denied signing the transaction.', null);
        var priv = self.unlockAccount(passphrase);
        if (!priv) return callback('Cannot unlock account.', null);
        var signedTx = util.signRawTx(txParams, priv);
        return callback(null, signedTx);
      }
    }
  }

  /**
   * @func setAccount
   * Set up coinbase
   * @param {*} address 
   * @param {*} privateKey 
   * @param {*} passphrase 
   */
  setAccount(address, privateKey, passphrase) {
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
  validatePrivateKey(addr, priv) {
    if (!addr || !priv) return false;
    priv = new Buffer(priv, 'hex');
    var valid = true;
    valid = valid && ethUtil.isValidPrivate(priv);
    var _addr = '0x' + ethUtil.privateToAddress(priv).toString('hex');
    valid = valid && (_addr === addr);
    return valid;
  }

  /**
   * @func setPassphrase
   * To unlock account, user must set temporarily passphrase to store.
   * @param {*} passphrase 
   */
  setPassphrase(passphrase) {
    var acc = this.store.get('ACCOUNT');
    acc.PASSPHRASE = passphrase;
    this.store.set('ACCOUNT', acc);
  }

  /**
   * @func constructPassword
   * Construct password from passphrase and salt
   * @param {*} passphrase 
   * @param {*} salt 
   */
  constructPassword(passphrase, salt) {
    if (!passphrase || !salt) return null;
    var password = cryptoJS.PBKDF2(passphrase, salt, { keySize: 512 / 32, iterations: 1000 });
    return password.toString();
  }

  /**
   * @func unlockAccount
   * Return private key in plain
   */
  unlockAccount(passphrase) {
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
  getAddress() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return [];
    return [acc.ADDRESS];
  }
  getPassphrase() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return null;
    var passphrase = acc.PASSPHRASE;
    // For safety, everytime unlock account had done, it must be clear passphrase.
    acc.PASSPHRASE = null;
    this.store.set('ACCOUNT', acc);
    return passphrase;
  }
  getPrivateKey() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return null;
    return acc.PRIVATEKEY;
  }
  getSalt() {
    var acc = this.store.get('ACCOUNT');
    if (!acc || typeof acc !== 'object') return null;
    return acc.SALT;
  }
}

module.exports = SoftWallet;