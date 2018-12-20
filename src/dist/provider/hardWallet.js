'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Engine = require('./engine').zeroc;
var Store = require('./store').sessionStorage;
var util = require('../util');

var error = require('../error');

var HardWallet = function () {
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
  function HardWallet(net, accOpts) {
    _classCallCheck(this, HardWallet);

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


  _createClass(HardWallet, [{
    key: 'opts',
    value: function opts() {
      var self = this;
      return {
        dataHandler: function dataHandler() {/* Turn off default logs */},
        errorHandler: function errorHandler() {/* Turn off default logs */},
        getAccounts: function getAccounts(callback) {
          self.hardware.getAddress(self.dpath, function (er, addr) {
            if (er) return callback(er, null);
            if (!addr) return callback(null, []);
            return callback(null, [addr.toLowerCase()]);
          });
        },
        approveTransaction: function approveTransaction(txParams, callback) {
          return callback(null, true);
        },
        signTransaction: function signTransaction(txParams, callback) {
          txParams.chainId = self.network;
          var tx = util.genRawTx(txParams, self.network);
          console.log(txParams, tx.raw);
          self.hardware.signTransaction(self.dpath, util.unpadHex(tx.hex), function (er, signature) {
            if (er) return callback(er, null);
            console.log(signature);
            var signedTx = tx.raw;
            signedTx.v = Buffer.from(signature.v, 'hex');
            signedTx.r = Buffer.from(signature.r, 'hex');
            signedTx.s = Buffer.from(signature.s, 'hex');
            console.log(util.padHex(signedTx.serialize().toString('hex')));
            return callback(null, util.padHex(signedTx.serialize().toString('hex')));
            return callback(null, '0x');
          });
        }
      };
    }

    /**
     * @func setAccount
     * Set up coinbase
     * @param {*} address 
     */

  }, {
    key: 'setAccount',
    value: function setAccount(getAddress, signTransaction) {
      if (!getAddress || typeof getAddress !== 'function') {
        console.error('getAddress must be a function');
        return false;
      }
      if (!signTransaction || typeof signTransaction !== 'function') {
        console.error('signTransaction must be a function');
        return false;
      }

      this.hardware = { getAddress: getAddress, signTransaction: signTransaction };
      return true;
    }
  }]);

  return HardWallet;
}();

module.exports = HardWallet;