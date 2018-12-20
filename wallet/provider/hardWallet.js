var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

const error = require('../error');

class HardWallet {
  /**
   * @constructor
   * @param {*} net - chainCode
   * @param {*} accOpts - accOpts = {
   *   signTransaction: (function) ...
   *   getAddress: (function) ...
   *   dpath: (optional) ...
   *   index: (optional) ...
   * }
   */
  constructor(net, accOpts) {
    accOpts = accOpts || {};
    this.network = util.chainCode(net);
    var engine = new Engine(this.network, this.opts());
    this.store = new Store();
    this.hardware = null;
    this.dpath = util.addDPath(accOpts.dpath, accOpts.index);
    var ok = this.setAccount(accOpts.getAddress, accOpts.signTransaction);
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
      errorHandler: function () { /* Turn off default logs */ },
      getAccounts: function (callback) {
        self.hardware.getAddress(self.dpath, function (er, addr) {
          if (er) return callback(er, null);
          if (!addr) return callback(null, []);
          return callback(null, [addr.toLowerCase()]);
        })
      },
      approveTransaction: function (txParams, callback) {
        return callback(null, true);
      },
      signTransaction: function (txParams, callback) {
        txParams.chainId = self.network;
        var tx = util.genRawTx(txParams, self.network);
        self.hardware.signTransaction(self.dpath, util.unpadHex(tx.hex), function (er, signature) {
          if (er) return callback(er, null);
          var signedTx = tx.raw;
          signedTx.v = Buffer.from(signature.v, 'hex');
          signedTx.r = Buffer.from(signature.r, 'hex');
          signedTx.s = Buffer.from(signature.s, 'hex');
          return callback(null, util.padHex(signedTx.serialize().toString('hex')));
          return callback(null, '0x');
        });
      }
    }
  }

  /**
   * @func setAccount
   * Set up coinbase
   * @param {*} address 
   */
  setAccount(getAddress, signTransaction) {
    if (!getAddress || typeof getAddress !== 'function') {
      console.error('getAddress must be a function');
      return false;
    }
    if (!signTransaction || typeof signTransaction !== 'function') {
      console.error('signTransaction must be a function');
      return false;
    }

    this.hardware = { getAddress: getAddress, signTransaction: signTransaction };
    return true
  }
}

module.exports = HardWallet;