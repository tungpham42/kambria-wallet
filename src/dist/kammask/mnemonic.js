'use strict';

var ethUtil = require('ethereumjs-util');
var bip39 = require('bip39');
var HDKey = require('hdkey');
var util = require('../util');

var Mnemonic = function Mnemonic() {};

var DEFAULT_ETH_DERIVATION_PATH = "m/44'/60'/0'/0";

Mnemonic.mnemonicToSeed = function (mnemonic, password) {
  if (!bip39.validateMnemonic(mnemonic)) {
    console.error('Invalid mnemonic');
    return null;
  }
  return bip39.mnemonicToSeed(mnemonic.trim(), password);
};

Mnemonic.seedToHDKey = function (seed) {
  if (!Buffer.isBuffer(seed)) {
    console.error('Seed must be type of buffer');
    return null;
  }
  return HDKey.fromMasterSeed(seed);
};

Mnemonic.hdkeyToAddress = function (hdkey, path, index) {
  path = path || DEFAULT_ETH_DERIVATION_PATH;
  var dpath = path + '/' + index;
  var child = hdkey.derive(dpath);
  if (child.publicKey) var addr = ethUtil.pubToAddress(child.publicKey, true /** multi pub-format */);else if (child.publicKey) var addr = ethUtil.privateToAddress(child.publicKey);else return null;
  return util.padHex(addr.toString('hex'));
};

Mnemonic.hdkeyToAccount = function (hdkey, path, index) {
  path = path || DEFAULT_ETH_DERIVATION_PATH;
  var dpath = path + '/' + index;
  var child = hdkey.derive(dpath);
  var priv = child.privateKey;
  var addr = ethUtil.privateToAddress(priv);
  return { address: util.padHex(addr.toString('hex')), privateKey: priv.toString('hex') };
};

module.exports = Mnemonic;