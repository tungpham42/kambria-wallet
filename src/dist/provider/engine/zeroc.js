'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Web3 = require('web3');
var ZeroClientProvider = require('web3-provider-engine/zero.js');

var _defaut = require('./defaultFunc');
var getRPC = require('../rpc');
var error = require('../../error');

var Zeroc =
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
  if (!rpc) throw new Error(error.CANNOT_CONNECT_RPC);
  if (!opts) opts = {};

  var self = this; // Globalize this

  this.RPC = rpc;
  this.dataHandler = !opts.dataHandler || typeof opts.dataHandler !== 'function' ? _defaut.dataHandler : opts.dataHandler;
  this.errorHandler = !opts.errorHandler || typeof opts.errorHandler !== 'function' ? _defaut.errorHandler : opts.errorHandler;
  this.getAccounts = !opts.getAccounts || typeof opts.getAccounts !== 'function' ? _defaut.getAccounts : opts.getAccounts;
  this.approveTransaction = !opts.approveTransaction || typeof opts.approveTransaction !== 'function' ? _defaut.approveTransaction : opts.approveTransaction;
  this.signTransaction = !opts.signTransaction || typeof opts.signTransaction !== 'function' ? _defaut.signTransaction : opts.signTransaction;

  var providerEngine = ZeroClientProvider({
    rpcUrl: rpc,
    getAccounts: self.getAccounts,
    approveTransaction: self.approveTransaction,
    signTransaction: self.signTransaction
  });

  this.web3 = new Web3(providerEngine);

  providerEngine.on('block', function (block) {
    self.dataHandler(block);
  });
  providerEngine.on('error', function (er) {
    self.errorHandler(er);
  });
};

module.exports = Zeroc;