import React, { Component } from 'react';

import { Metamask } from '@kambria/kambria-wallet';


class TestMetamask extends Component {
  constructor() {
    super();
    this.provider = new Metamask();
    this.state = {
      RESULT: null,
      ERROR: null,
      METAMASK: {
        loggedIn: null,
        code: null,
        status: null,
        message: null
      }
    }
  }

  componentDidMount() {
    // Get metamask status
    this.provider.metaStatus().then(re => {
      this.setState({ METAMASK: re });
    }).catch(er => {
      this.setState({ METAMASK: er });
    });
    // Watch metamask
    this.provider.watch().then(watcher => {
      watcher.event.on('data', re => {
        this.setState({ RESULT: re, ERROR: null });
      });
      watcher.event.on('error', er => {
        this.setState({ RESULT: null, ERROR: er.toString() });
      });
    }).catch(er => {
      this.setState({ RESULT: null, ERROR: er.toString() });
    });
  }

  loggedIn() {
    if (this.state.METAMASK && this.state.METAMASK.loggedIn != null)
      return (<p>LOGGED_IN: {this.state.METAMASK.loggedIn.toString()}</p>);
  }

  code() {
    if (this.state.METAMASK && this.state.METAMASK.code)
      return (<p>CODE: {this.state.METAMASK.code}</p>);
  }

  status() {
    if (this.state.METAMASK && this.state.METAMASK.status)
      return (<p>STATUS: {this.state.METAMASK.status}</p>);
  }

  message() {
    if (this.state.METAMASK && this.state.METAMASK.message)
      return (<p>MESSAGE: {this.state.METAMASK.message}</p>);
  }

  result() {
    if (this.state.RESULT)
      return (
        <div>
          <p>NETWORK: {this.state.RESULT.NETWORK}</p>
          <p>ACCOUNT: {this.state.RESULT.ACCOUNT}</p>
          <p>BALANCE: {this.state.RESULT.BALANCE}</p>
        </div>
      );
  }

  error() {
    if (this.state.ERROR)
      return (<p>ERROR: {this.state.ERROR}</p>);
  }

  render() {
    return (
      <div>
        <h1>Metamask testing</h1>
        {this.loggedIn()}
        {this.code()}
        {this.status()}
        {this.message()}
        {this.result()}
        {this.error()}
      </div>
    );
  }
}

export default TestMetamask;