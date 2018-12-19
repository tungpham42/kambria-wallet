'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionStorage = function () {
  function SessionStorage() {
    _classCallCheck(this, SessionStorage);

    this.store = window.sessionStorage;
  }

  _createClass(SessionStorage, [{
    key: 'get',
    value: function get(key) {
      if (!key) return this.store;
      return JSON.parse(this.store.getItem(key));
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (!key || !value) return console.error('Key or value is null');
      return this.store.setItem(key, JSON.stringify(value));
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      if (!key) return console.error('Key is null');
      return this.store.removeItem(key);
    }
  }, {
    key: 'removeAll',
    value: function removeAll() {
      return this.store.clear();
    }
  }]);

  return SessionStorage;
}();

module.exports = SessionStorage;