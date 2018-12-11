'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Web3 = require('web3');
var EventEmitter = require('events');

var ERROR = require('../error');
var CHANGED = require('../changed');

var STATUS = require('./status');

var Metamask = function () {
  function Metamask() {
    _classCallCheck(this, Metamask);

    var Emitter = function (_EventEmitter) {
      _inherits(Emitter, _EventEmitter);

      function Emitter() {
        _classCallCheck(this, Emitter);

        return _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).apply(this, arguments));
      }

      return Emitter;
    }(EventEmitter);

    this.emitter = new Emitter();

    this.USER = {
      NETWORK: null,
      ACCOUNT: null,
      BALANCE: null,
      CHANGED: null
    };
    if (!window.web3 || !window.web3.currentProvider) return false;
    this.web3 = new Web3(window.web3.currentProvider);
  }

  /**
   * Check metamask totally
   * @param {*} netcode - optional 
   */


  _createClass(Metamask, [{
    key: 'metaStatus',
    value: function metaStatus() {
      var netcode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var self = this;
      return new Promise(function (resolve, reject) {
        if (!window.web3 || !window.web3.currentProvider) return reject(STATUS.NO_METAMASK_INSTALLED);
        self.getNetwork().then(function (net) {
          self.getAccount().then(function (acc) {
            if (netcode && netcode !== net) return reject(STATUS.METAMASK_FOUND_LOGGED_IN_NETWORK_INVALID);
            return resolve(STATUS.METAMASK_LOGGED_IN);
          }).catch(function (er) {
            if (er) reject(STATUS.METAMASK_FOUND_NO_LOGGED_IN);
          });
        }).catch(function (er) {
          if (er) reject(STATUS.NETWORK_ERROR);
        });
      });
    }

    /**
     * Check valid address
     * @param {*} address 
     */

  }, {
    key: 'isAddress',
    value: function isAddress(address) {
      return this.web3.isAddress(address);
    }

    /**
     * Get network id
     */

  }, {
    key: 'getNetwork',
    value: function getNetwork() {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.web3.version.getNetwork(function (er, re) {
          if (er) return reject(er);
          return resolve(re);
        });
      });
    }

    /**
     * Get account info
     */

  }, {
    key: 'getAccount',
    value: function getAccount() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var re = self.web3.eth.coinbase;
        if (!re || !self.isAddress(re)) return reject(ERROR.CANNOT_GET_ACCUNT);
        return resolve(re);
      });
    }

    /**
     * Get account balance
     * @param {*} address 
     */

  }, {
    key: 'getBalance',
    value: function getBalance(address) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (!self.isAddress(address)) return reject(ERROR.CANNOT_GET_ACCUNT);
        self.web3.eth.getBalance(address, function (er, re) {
          if (er) return reject(er);
          return resolve(Number(re));
        });
      });
    }

    /**
     * Fetch info of USER
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.getNetwork().then(function (re) {
          self.USER.NETWORK = re;
          return self.getAccount();
        }).then(function (re) {
          self.USER.ACCOUNT = re;
          if (!self.USER.ACCOUNT) return reject(ERROR.CANNOT_GET_ACCUNT);
          return self.getBalance(self.USER.ACCOUNT);
        }).then(function (re) {
          self.USER.BALANCE = re;
          var data = JSON.parse(JSON.stringify(self.USER));
          return resolve(data);
        }).catch(function (er) {
          return reject(er);
        });
      });
    }

    /**
     * Watch any changes of provider
     */

  }, {
    key: 'watch',
    value: function watch() {
      var self = this;
      return new Promise(function (resolve) {
        var watchCurrentAccount = setInterval(function () {
          // Watch switching network event
          self.getNetwork().then(function (re) {
            if (self.USER.NETWORK !== re) {
              self.USER.NETWORK = re;
              self.USER.CHANGED = CHANGED.NETWORK;
              var data = JSON.parse(JSON.stringify(self.USER));
              return self.emitter.emit('data', data);
            }
          }).catch(function (er) {
            return self.emitter.emit('error', er);
          });
          // Watch switching account event
          self.getAccount().then(function (re) {
            if (self.USER.ACCOUNT !== re) {
              self.USER.ACCOUNT = re;
              self.USER.CHANGED = CHANGED.ACCOUNT;
              var data = JSON.parse(JSON.stringify(self.USER));
              return self.emitter.emit('data', data);
            }
          }).catch(function (er) {
            return self.emitter.emit('error', er);
          });
          // Watch changing balance event
          self.getBalance(self.USER.ACCOUNT).then(function (re) {
            if (self.USER.BALANCE !== re) {
              self.USER.BALANCE = re;
              self.USER.CHANGED = CHANGED.BALANCE;
              var data = JSON.parse(JSON.stringify(self.USER));
              return self.emitter.emit('data', data);
            }
          }).catch(function (er) {
            return self.emitter.emit('error', er);
          });
        }, 2000);

        var stopWatching = function stopWatching() {
          clearInterval(watchCurrentAccount);
          self.emitter.removeAllListeners();
        };

        return resolve({ stopWatching: stopWatching, event: self.emitter });
      });
    }
  }]);

  return Metamask;
}();

exports.default = Metamask;