var WalletInterface = require('../walletInterface');
var Web3 = require('web3');
var util = require('../util');

const STATUS = require('./status');
const ERROR = require('../error');


class Metamask extends WalletInterface {
  constructor(net, type) {
    super(net, type);
  }

  getAccountByMetamask(callback) {
    this.provider = window.ethereum;
    if (!this.provider)
      return callback(ERROR.CANNOT_FOUND_PROVIDER, null);
    if (util.chainCode(this.provider.networkVersion) != util.chainCode(this.net))
      return callback(ERROR.INVALID_NETWORK, null);

    this.provider.enable().then(re => {
      return callback(null, re);
    }).catch(er => {
      return callback(er, null);
    });
  }

  setAccountByMetamask(callback) {
    var self = this;
    this.provider = window.ethereum;
    if (!this.provider)
      return callback(ERROR.CANNOT_FOUND_PROVIDER, null);
    if (util.chainCode(this.provider.networkVersion) != util.chainCode(this.net))
      return callback(ERROR.INVALID_NETWORK, null);

    this.provider.enable().then(re => {
      self.web3 = new Web3(self.provider);
      return callback(null, self.web3);
    }).catch(er => {
      return callback(er, null);
    });
  }

  /**
   * Check metamask totally
   * @param {*} netcode - optional 
   */
  metaStatus(netcode = 0) {
    var self = this;
    return new Promise((resolve, reject) => {
      if (!window.web3 || !window.web3.currentProvider) return reject(STATUS.NO_METAMASK_INSTALLED);
      self.getNetwork().then((net) => {
        self.getAccount().then(acc => {
          if (netcode && netcode !== net) return reject(STATUS.METAMASK_FOUND_LOGGED_IN_NETWORK_INVALID);
          return resolve(STATUS.METAMASK_LOGGED_IN);
        }).catch(er => {
          if (er) reject(STATUS.METAMASK_FOUND_NO_LOGGED_IN);
        });
      }).catch(er => {
        if (er) reject(STATUS.NETWORK_ERROR);
      });
    });
  }
}

module.exports = Metamask;