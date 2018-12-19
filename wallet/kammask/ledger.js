require("@babel/polyfill"); // To fix  error 'regeneratorRuntime is not defined'

import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { callbackify } from "util";
const error = require('../error');
var util = require('../util');

const DEFAULT_ETH_DERIVATION_PATH = "m/44'/60'/0'/0";
const TIMEOUT = 3000;

var Ledger = function () { }

Ledger.sign = function (txParams, callback) {
  Ledger.getTransport(function (er, transport) {
    if (er || !transport) return console.error(error.UNSUPPORT_U2F);

    var eth = new Eth(transport);
    return callback(null, eth);
  });
}

Ledger.getTransport = function (callback) {
  TransportU2F.isSupported().then(re => {
    if (!re) {
      return callback(error.UNSUPPORT_U2F, null);
    }
    TransportU2F.create(TIMEOUT, TIMEOUT).then(re => {
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    });
  }).catch(er => {
    return callback(er, null);
  })
}

module.exports = Ledger;