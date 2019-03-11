import React, { Component } from 'react';
import FiniteStateMachine from './finiteStateMachine';

import SellectWallet from './skin/react/sellectWallet';
import InputAsset from './skin/react/inputAsset';
import ConnectDevice from './skin/react/connectDevice';
import ConfirmAddress from './skin/react/confirmAddress';
import InputPassphrase from './skin/react/inputPassphrase';
import ErrorModal from './skin/react/core/error';


const ERROR = 'Wallet was broken';
const DEFAULT_STATE = {
  step: null,
  error: '',
  passphrase: false,
  returnPassphrase: null
}


class Wallet extends Component {

  /**
   * @props net - Chain code
   * @props visible - Boolean
   * @props done - Callback function
   */
  constructor(props) {
    super(props);

    this.FSM = new FiniteStateMachine();

    this.state = {
      net: this.props.net ? this.props.net : 1, // mainnet as default
      ...DEFAULT_STATE
    }

    if (this.props.visible) this.setState({ step: this.FSM.next().step });
    this.done = this.props.done;
    this.callback = this.callback.bind(this);
    this.endError = this.endError.bind(this);

    var self = this;
    window.GET_PASSPHRASE = function (callback) {
      self.setState({ passphrase: false, returnPassphrase: null }, function () {
        self.setState({ passphrase: true, returnPassphrase: callback });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) this.setState({ step: this.FSM.next().step });
      else this.setState(DEFAULT_STATE);
    }
  }

  /**
   * Flow management
   */

  callback(er, re) {
    let self = this;
    if (er) return this.setState({ error: er, step: 'Error' }, () => {
      self.FSM.reset();
    });
    if (!re) return this.FSM.reset(); // Use skip the registration.
    let state = this.FSM.next(re);
    if (state.step === 'Error') {
      return this.setState({ error: ERROR, step: state.step }, () => {
        self.FSM.reset();
      });
    }
    if (state.step === 'Success') return this.setState({ step: state.step }, () => {
      self.done(null, state.provider);
      self.FSM.reset();
    });
    return this.setState({ step: state.step });
  }

  endError() {
    this.done(this.state.error, null);
    this.FSM.reset();
  }

  render() {
    return (
      <div>
        <SellectWallet visible={this.state.step === 'SelectWallet' && !this.state.passphrase} data={{ ...this.FSM.data, net: this.state.net }} done={this.callback} />
        <InputAsset visible={this.state.step === 'InputAsset' && !this.state.passphrase} data={{ ...this.FSM.data, net: this.state.net }} done={this.callback} />
        <ConnectDevice visible={this.state.step === 'ConnectDevice' && !this.state.passphrase} data={{ ...this.FSM.data, net: this.state.net }} done={this.callback} />
        <ConfirmAddress visible={this.state.step === 'ConfirmAddress' && !this.state.passphrase} data={{ ...this.FSM.data, net: this.state.net }} done={this.callback} />
        <InputPassphrase visible={this.state.passphrase} done={(er, re) => { this.state.returnPassphrase(er, re) }} />
        <ErrorModal visible={this.state.step === 'Error' && !this.state.passphrase} error={this.state.error} done={this.endError} />
      </div>
    )
  }

}

export default Wallet; 