require("@babel/polyfill"); // To fix  error 'regeneratorRuntime is not defined'
/* eslint-disable import/first */
import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
var util = require('../util');
const error = require('../error');
const _default = require('./defaultConst');

/**
 * Hardwallet type
 */
var Ledger = function () { }

Ledger.getAddress = function (dpath, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);


    var eth = new Eth(transport);
    eth.getAddress(dpath, false, false).then(re => {
      if (!re || !re.address) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re.address);
    }).catch(er => {
      return callback(er, null);
    }).finally(() => {
      Ledger.closeTransport(transport);
    });
  });
}

Ledger.signTransaction = function (dpath, rawTx, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  if (!rawTx) return callback(error.INVALID_TX, null);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);

    var eth = new Eth(transport);
    eth.signTransaction(dpath, rawTx).then(re => {
      if (!re) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    }).finally(() => {
      Ledger.closeTransport(transport);
    });
  });
}

Ledger.getTransport = function (callback) {
  TransportU2F.isSupported().then(re => {
    if (!re) return callback(error.UNSUPPORT_U2F, null);

    TransportU2F.create(_default.TIMEOUT, _default.TIMEOUT).then(re => {
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    });
  }).catch(er => {
    return callback(er, null);
  });
}

Ledger.closeTransport = function (transport) {
  return transport.close();
}

module.exports = Ledger;