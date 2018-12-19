'use strict';

var ethWallet = require('ethereumjs-wallet');
var util = require('../util');

var Keystore = function Keystore() {};

Keystore.fromV1 = function (input, password) {
  var wallet = ethWallet.fromV3(input, password);
  var account = {
    address: util.padHex(wallet.getAddress()),
    privateKey: wallet.getPrivateKey().toString('hex')
  };
  return account;
};

Keystore.fromV3 = function (input, password) {
  var wallet = ethWallet.fromV3(input, password, true /** non-strict */);
  var account = {
    address: util.padHex(wallet.getAddress()),
    privateKey: wallet.getPrivateKey().toString('hex')
  };

  return account;
};

module.exports = Keystore;