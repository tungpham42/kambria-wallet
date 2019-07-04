var ethWallet = require('ethereumjs-wallet');
var keythereum = require('keythereum');
var privatekey = require('./privatekey')
var util = require('../util');

/**
 * Softwallet type
 */
var Keystore = function () { }

// DEPRECATED
Keystore.fromV1 = function (input, password) {
  var wallet = ethWallet.fromV3(input, password);
  var account = {
    address: util.padHex(wallet.getAddress()),
    privateKey: wallet.getPrivateKey().toString('hex')
  }
  return account;
}

// DEPRECATED
Keystore.fromV3 = function (input, password) {
  var wallet = ethWallet.fromV3(input, password, true /* non-strict */);
  var account = {
    address: util.padHex(wallet.getAddress()),
    privateKey: wallet.getPrivateKey().toString('hex')
  }
  return account;
}

// Faster than two above
Keystore.recover = function (input, password) {
  var priv = keythereum.recover(password, input);
  return privatekey.privatekeyToAccount(priv);
}

module.exports = Keystore;