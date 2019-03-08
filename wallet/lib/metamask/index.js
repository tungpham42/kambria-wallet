var WalletInterface = require('../walletInterface');
var Web3 = require('web3');

const STATUS = require('./status');


class Metamask extends WalletInterface {
  constructor() {
    super();

    if (!window.web3 || !window.web3.currentProvider) throw new Error(ERROR.CANNOT_FOUND_PROVIDER);
    this.web3 = new Web3(window.web3.currentProvider);
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