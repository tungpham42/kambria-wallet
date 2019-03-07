import React, { Component } from 'react';
import Modal from './core/modal';
import { Button } from './core/buttons';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  passphrase: ''
}
const ERROR = 'Used denied to enter passpharse';


class InputPassphrase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }

    this.done = this.props.done;

    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onClose() {
    this.setState({ visible: false });
    this.done(ERROR, null);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({ visible: false });
    if (!this.state.passphrase) this.done(ERROR, null);
    else this.done(null, this.state.passphrase);

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  onChange(e) {
    this.setState({ passphrase: e.target.value });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        ...DEFAULT_STATE
      }, () => {
        // Autofocus
        setTimeout(() => {
          if (this.passpharseName) this.passpharseName.focus();
        }, 1);
      });
    }
  }

  render() {
    return (
      <Modal className={cx("wallet-modal", "enter-passphrase")}
        visible={this.state.visible}
        onClickBackdrop={this.onClose}
        dialogClassName={cx("modal-dialog-centered")}>

        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose} />
          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ "color": "#13CDAC", "fontSize": "24px" }}>Enter Passphrase</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ "color": "#282F38", "fontSize": "16px", "lineHeight": "18px" }}>Please enter an temporary passphrase to proceed</p>

          <input type="password"
            name="passphrase"
            value={this.state.passphrase}
            onChange={this.onChange}
            ref={(name) => { this.passpharseName = name; }} />

          <Button
            type="primary"
            size="sm"
            customStyle={{ "display": "block", "margin": "16px auto 0" }}
            onClick={this.handleSubmit}
          >Confirm</Button>
        </div>

      </Modal>
    );
  }
}

export default InputPassphrase;