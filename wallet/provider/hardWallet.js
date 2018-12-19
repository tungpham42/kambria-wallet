var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

const error = require('../error');

class HardWallet{
  constructor(net) {
    var engine = new Engine(net, this.opts());
    this.store = new Store();
    var ok = this.setAccount();
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
        // Sign and save rawTx here
        return callback(null, true);
      },
      signTransaction: function (txParams, callback) {
        // Read and validate signedTx here
        return callback(null, signedTx);
      }
    }
  }

  /**
   * @func setAccount
   * Set up coinbase
   */
  setAccount() {
    var address = null; // get address from hardware here
    if (!address) {
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

}