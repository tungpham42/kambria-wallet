"use strict";

var _hwAppEth = require("@ledgerhq/hw-app-eth");

var _hwAppEth2 = _interopRequireDefault(_hwAppEth);

var _hwTransportU2f = require("@ledgerhq/hw-transport-u2f");

var _hwTransportU2f2 = _interopRequireDefault(_hwTransportU2f);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("@babel/polyfill"); // To fix  error 'regeneratorRuntime is not defined'

var util = require('../util');
var error = require('../error');
var _default = require('./defaultConst');

/**
 * Hardwallet type
 */
var Ledger = function Ledger() {};

Ledger.getAddress = function (dpath, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);

    var eth = new _hwAppEth2.default(transport);
    eth.getAddress(dpath, false, false).then(function (re) {
      if (!re || !re.address) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re.address);
    }).catch(function (er) {
      return callback(er, null);
    });
  });
};

Ledger.signTransaction = function (dpath, rawTx, callback) {
  dpath = dpath || util.addDPath(_default.ETH_DERIVATION_PATH, _default.ACCOUNT_INDEX);
  if (!rawTx) return callback(error.INVALID_TX, null);
  Ledger.getTransport(function (er, transport) {
    if (er) return callback(er, null);
    if (!transport) return callback(error.UNSUPPORT_U2F, null);

    var eth = new _hwAppEth2.default(transport);
    eth.signTransaction(dpath, rawTx).then(function (re) {
      if (!re) return callback(error.CANNOT_CONNECT_HARDWARE, null);
      return callback(null, re);
    }).catch(function (er) {
      return callback(er, null);
    });
  });
};

Ledger.getTransport = function (callback) {
  _hwTransportU2f2.default.isSupported().then(function (re) {
    if (!re) {
      return callback(error.UNSUPPORT_U2F, null);
    }
    _hwTransportU2f2.default.create(_default.TIMEOUT, _default.TIMEOUT).then(function (re) {
      return callback(null, re);
    }).catch(function (er) {
      return callback(er, null);
    });
  }).catch(function (er) {
    return callback(er, null);
  });
};

module.exports = Ledger;