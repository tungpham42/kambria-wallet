'use strict';

module.exports = {
  INIT: {
    loggedIn: false,
    code: 404,
    status: 'INIT',
    message: 'Initialing'
  },
  NO_METAMASK_INSTALLED: {
    loggedIn: false,
    code: 400,
    status: 'NO_METAMASK_INSTALLED',
    message: 'Metamask was not installed'
  },
  METAMASK_FOUND_NO_LOGGED_IN: {
    loggedIn: false,
    code: 401,
    status: 'METAMASK_FOUND_NO_LOGGED_IN',
    message: 'Metamask was not logged in'
  },
  METAMASK_FOUND_LOGGED_IN_NETWORK_INVALID: {
    loggedIn: false,
    code: 402,
    status: 'METAMASK_FOUND_LOGGED_IN_NETWORK_INVALID',
    message: 'Network is invalid'
  },
  METAMASK_FOUND_NO_ACCOUND: {
    loggedIn: false,
    code: 403,
    status: 'METAMASK_FOUND_NO_ACCOUND',
    message: 'Has no account'
  },
  NETWORK_ERROR: {
    loggedIn: false,
    code: 404,
    status: 'NETWORK_ERROR',
    message: 'Has no connection'
  },
  METAMASK_LOGGED_IN: {
    loggedIn: true,
    code: 200,
    status: 'METAMASK_LOGGED_IN',
    message: 'Success'
  }
};