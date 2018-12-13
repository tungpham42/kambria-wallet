const Web3 = require('web3')
const ZeroClientProvider = require('web3-provider-engine/zero.js')

const getRPC = require('./rpc');
const ERROR = require('../error');

class Zeroc {
  /**
   * 
   * @param {*} net - network ID or net work name
   * @param {*} opts - dataHandler: handle event new block
   *                   errorHandler: handle event error sync
   *                   getAccounts: return coinbase
   *                   approveTransaction: decrypt encrypted private key and pass next
   *                   signTransaction: sign raw tx
   */
  constructor(net, opts) {
    const rpc = getRPC(net);
    if (!rpc) throw new Error(ERROR.CANNOT_CONNECT_RPC);
    if (!opts) opts = {};

    var self = this; // Globalize this

    this.RPC = rpc;
    this._dataHandler = (!opts.dataHandler || typeof opts.dataHandler !== 'function') ? this._defaultDataHandler : opts.dataHandler;
    this._errorHandler = (!opts.errorHandler || typeof opts.errorHandler !== 'function') ? this._defaultErrorHandler : opts.errorHandler;
    this._getAccounts = (!opts.getAccounts || typeof opts.getAccounts !== 'function') ? this._defaultGetAccounts : opts.getAccounts;
    this._approveTransaction = (!opts.approveTransaction || typeof opts.approveTransaction !== 'function') ? this._defaultApproveTransaction : opts.approveTransaction;
    this._signTransaction = (!opts.signTransaction || typeof opts.signTransaction !== 'function') ? this._defaultSignTransaction : opts.signTransaction;

    const providerEngine = ZeroClientProvider({
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

  _defaultDataHandler(block) {
    console.log('=========== NEW BLOCK ===========');
    console.log('BLOCK NUMBER:', parseInt('0x' + block.number.toString('hex')));
    console.log('HASH:', '0x' + block.hash.toString('hex'));
    console.log('=================================');
  }

  _defaultErrorHandler(error) {
    console.log('============= ERROR =============');
    console.error(error.stack);
    console.log('=================================');
  }

  _defaultGetAccounts(callback) {
    var er = 'getAccounts() is not set yet'
    console.error(er);
    return callback(er, null);
  }

  _defaultApproveTransaction(txParams, callback) {
    var er = 'approveTransaction() is not set yet'
    console.error(er);
    return callback(er, null);
  }

  _defaultSignTransaction(callback) {
    var er = 'signTransaction() is not set yet'
    console.error(er);
    return callback(er, null);
  }
}

module.exports = Zeroc;