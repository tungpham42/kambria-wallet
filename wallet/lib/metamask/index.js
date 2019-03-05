var Web3 = require('web3');
var EventEmitter = require('events');

const error = require('../error');
const CHANGED = require('./changed');
const STATUS = require('./status');


class Metamask {
  constructor() {
    class Emitter extends EventEmitter { }
    this.emitter = new Emitter();

    this.USER = {
      NETWORK: null,
      ACCOUNT: null,
      BALANCE: null,
      CHANGED: null
    };
    if (!window.web3 || !window.web3.currentProvider) throw new Error(error.CANNOT_FOUND_PROVIDER);
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

  /**
   * Check valid address
   * @param {*} address 
   */
  isAddress(address) {
    return this.web3.isAddress(address);
  }

  /**
   * Get network id
   */
  getNetwork() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.web3.version.getNetwork((er, re) => {
        if (er) return reject(er);
        return resolve(re);
      });
    });
  }

  /**
   * Get account info
   */
  getAccount() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.web3.eth.getAccounts((er, re) => {
        if (er) return reject(er);
        if (re.length <= 0 || !re[0] || !self.isAddress(re[0])) return reject(error.CANNOT_GET_ACCOUNT);
        return resolve(re[0]);
      });
    });
  }

  /**
   * Get account balance
   * @param {*} address 
   */
  getBalance(address) {
    var self = this;
    return new Promise((resolve, reject) => {
      if (!self.isAddress(address)) return reject(error.CANNOT_GET_BALANCE);
      self.web3.eth.getBalance(address, (er, re) => {
        if (er) return reject(er);
        return resolve(Number(re));
      });
    });
  }

  /**
   * Fetch info of USER
   */
  fetch() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.getNetwork().then(re => {
        self.USER.NETWORK = re;
        return self.getAccount();
      }).then(re => {
        self.USER.ACCOUNT = re;
        if (!self.USER.ACCOUNT) return reject(error.CANNOT_GET_ACCOUNT);
        return self.getBalance(self.USER.ACCOUNT);
      }).then(re => {
        self.USER.BALANCE = re;
        let data = JSON.parse(JSON.stringify(self.USER));
        return resolve(data);
      }).catch(er => {
        return reject(er);
      });
    });
  }

  /**
   * Watch any changes of provider
   */
  watch() {
    var self = this;
    return new Promise((resolve) => {
      var watchCurrentAccount = setInterval(() => {
        // Watch switching network event
        self.getNetwork().then(re => {
          if (self.USER.NETWORK !== re) {
            self.USER.NETWORK = re;
            self.USER.CHANGED = CHANGED.NETWORK;
            let data = JSON.parse(JSON.stringify(self.USER));
            return self.emitter.emit('data', data);
          }
        }).catch(er => {
          self.USER.NETWORK = null;
          return self.emitter.emit('error', er);
        });
        // Watch switching account event
        self.getAccount().then(re => {
          if (self.USER.ACCOUNT !== re) {
            self.USER.ACCOUNT = re;
            self.USER.CHANGED = CHANGED.ACCOUNT;
            let data = JSON.parse(JSON.stringify(self.USER));
            return self.emitter.emit('data', data);
          }
        }).catch(er => {
          self.USER.ACCOUNT = null;
          return self.emitter.emit('error', er);
        });
        // Watch changing balance event
        if (self.USER.ACCOUNT) self.getBalance(self.USER.ACCOUNT).then(re => {
          if (self.USER.BALANCE !== re) {
            self.USER.BALANCE = re;
            self.USER.CHANGED = CHANGED.BALANCE;
            let data = JSON.parse(JSON.stringify(self.USER));
            return self.emitter.emit('data', data);
          }
        }).catch(er => {
          self.USER.BALANCE = null;
          return self.emitter.emit('error', er);
        });
      }, 2000);

      var stopWatching = function () {
        clearInterval(watchCurrentAccount);
        self.emitter.removeAllListeners();
      }

      return resolve({ stopWatching: stopWatching, event: self.emitter });
    });
  }
}

module.exports = Metamask;