import React, { Component } from 'react';
import Modal from 'react-modal';

const ERROR = 'User denied to register';


class SellectWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.data = this.props.data;
    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
    this.onMetamask = this.onMetamask.bind(this);
    this.onIsoxys = this.onIsoxys.bind(this);
  }

  onClose(er) {
    er = er ? er : ERROR;
    this.setState({ visible: false });
    this.done(er, null);
  }

  onClickBackdrop() {
    this.setState({ visible: false });
    this.done(ERROR, null);
  }

  onMetamask() {
    this.setState({ visible: false });
    this.done(null, { wallet: 'metamask' });
  }

  onIsoxys() {
    this.setState({ visible: false });
    this.done(null, { wallet: 'isoxys' });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible)
      this.setState({ visible: this.props.visible });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.visible}
        onRequestClose={this.onClickBackdrop}
        style={this.props.style}
      >
        <h2>Hello</h2>
        <button onClick={this.onClose}>x</button>
        <div>
          <p>Please select your favour option:</p>
        </div>
        <button onClick={this.onMetamask}>Metamask</button>
        <button onClick={this.onIsoxys}>Isoxys</button>
      </Modal>
    );
  }
}

export default SellectWallet;