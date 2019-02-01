import React, { Component } from 'react';
import Modal from 'react-modal';


class InputPassphrase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }

    this.onClose = this.onClose.bind(this);
    this.onClickBackdrop = this.onClickBackdrop.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.props.done(null);
  }

  onClickBackdrop() {
    this.setState({ visible: false });
    this.props.done(null);
  }

  onNext(e) {
    e.preventDefault()
    this.setState({ visible: false });
    this.props.done('next');
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
        <h2>InputPassphrase</h2>
        <button onClick={this.onClose}>x</button>
        <div>
          <p>Please select your favour option:</p>
        </div>
        <form onSubmit={this.onNext}>
          <input type="text" />
          <button type="submit" >Next</button>
        </form>
      </Modal>
    );
  }
}

export default InputPassphrase;