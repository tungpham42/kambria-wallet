'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Web3 = require('web3');
var ZeroClientProvider = require('web3-provider-engine/zero.js');

var getRPC = require('./rpc');
var ERROR = require('../error');

var Zeroc = function () {
  /**
   * 
   * @param {*} net - network ID or net work name
   * @param {*} opts - dataHandler: handle event new block
   *                   errorHandler: handle event error sync
   *                   getAccounts: return coinbase
   *                   approveTransaction: decrypt encrypted private key and pass next
   *                   signTransaction: sign raw tx
   */
  function Zeroc(net, opts) {
    _classCallCheck(this, Zeroc);

    var rpc = getRPC(net);
    if (!rpc) throw new Error(ERROR.CANNOT_CONNECT_RPC);
    if (!opts) opts = {};

    var self = this; // Globalize this

    this.RPC = rpc;
    this._dataHandler = !opts.dataHandler || typeof opts.dataHandler !== 'function' ? this._defaultDataHandler : opts.dataHandler;
    this._errorHandler = !opts.errorHandler || typeof opts.errorHandler !== 'function' ? this._defaultErrorHandler : opts.errorHandler;
    this._getAccounts = !opts.getAccounts || typeof opts.getAccounts !== 'function' ? this._defaultGetAccounts : opts.getAccounts;
    this._approveTransaction = !opts.approveTransaction || typeof opts.approveTransaction !== 'function' ? this._defaultApproveTransaction : opts.approveTransaction;
    this._signTransaction = !opts.signTransaction || typeof opts.signTransaction !== 'function' ? this._defaultSignTransaction : opts.signTransaction;

    var providerEngine = ZeroClientProvider({
      rpcUrl: rpc,
      getAccounts: self._getAccounts,
      approveTransaction: self._approveTransaction,
      signTransaction: self._signTransaction
    });

    this.web3 = new Web3(providerEngine);

    providerEngine.on('block', function (block) {
      self._dataHandler(block);
    });
    providerEngine.on('error', function (er) {
      self._errorHandler(er);
    });
  }

  _createClass(Zeroc, [{
    key: '_defaultDataHandler',
    value: function _defaultDataHandler(block) {
      console.log('=========== NEW BLOCK ===========');
      console.log('BLOCK NUMBER:', parseInt('0x' + block.number.toString('hex')));
      console.log('HASH:', '0x' + block.hash.toString('hex'));
      console.log('=================================');
    }
  }, {
    key: '_defaultErrorHandler',
    value: function _defaultErrorHandler(error) {
      console.log('============= ERROR =============');
      console.error(error.stack);
      console.log('=================================');
    }
  }, {
    key: '_defaultGetAccounts',
    value: function _defaultGetAccounts(callback) {
      var er = 'getAccounts() is not set yet';
      console.error(er);
      return callback(er, null);
    }
  }, {
    key: '_defaultApproveTransaction',
    value: function _defaultApproveTransaction(txParams, callback) {
      var er = 'approveTransaction() is not set yet';
      console.error(er);
      return callback(er, null);
    }
  }, {
    key: '_defaultSignTransaction',
    value: function _defaultSignTransaction(callback) {
      var er = 'signTransaction() is not set yet';
      console.error(er);
      return callback(er, null);
    }
  }]);

  return Zeroc;
}();

module.exports = Zeroc;