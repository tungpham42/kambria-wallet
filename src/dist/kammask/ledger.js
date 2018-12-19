"use strict";

var _hwAppEth = require("@ledgerhq/hw-app-eth");

var _hwAppEth2 = _interopRequireDefault(_hwAppEth);

var _hwTransportU2f = require("@ledgerhq/hw-transport-u2f");

var _hwTransportU2f2 = _interopRequireDefault(_hwTransportU2f);

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("@babel/polyfill"); // To fix  error 'regeneratorRuntime is not defined'

var error = require('../error');
var util = require('../util');

var DEFAULT_ETH_DERIVATION_PATH = "m/44'/60'/0'/0";
var TIMEOUT = 3000;

var Ledger = function Ledger() {};

Ledger.sign = function (txParams, callback) {
  Ledger.getTransport(function (er, transport) {
    if (er || !transport) return console.error(error.UNSUPPORT_U2F);

    var eth = new _hwAppEth2.default(transport);
    return callback(null, eth);
  });
};

Ledger.getTransport = function (callback) {
  _hwTransportU2f2.default.isSupported().then(function (re) {
    if (!re) {
      return callback(error.UNSUPPORT_U2F, null);
    }
    _hwTransportU2f2.default.create(TIMEOUT, TIMEOUT).then(function (re) {
      return callback(null, re);
    }).catch(function (er) {
      return callback(er, null);
    });
  }).catch(function (er) {
    return callback(er, null);
  });
};

module.exports = Ledger;