import React, { Component } from 'react';
import { Button } from './core/buttons';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  mnemonic: '',
  password: ''
}


class MnemonicAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.handleChangeMnemonic = this.handleChangeMnemonic.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  handleChangeMnemonic(e) {
    this.setState({ mnemonic: e.target.value });
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.returnData2Parent();

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  returnData2Parent() {
    return this.props.done({
      subType: 'mnemonic',
      asset: {
        mnemonic: this.state.mnemonic,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <div>
        <form>
          <h3>Seed</h3>
          <p className={cx("type", "not-recommended")}>This is not a recommended way to access your wallet.</p>
          <p></p>

          <div>
            <span className={cx("label", "mt-3", "d-block")}>Enter seed</span>
            <input type="text" value={this.state.mnemonic} onChange={this.handleChangeMnemonic} />

            <span className={cx("label", "mt-3", "d-block")}>Enter password (Optional)</span>
            <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
          </div>

          <Button
            type="primary"
            size="sm"
            customStyle={{ "float": "right", "marginTop": "24px", "width": "170px" }}
            onClick={this.handleSubmit}
          >OK</Button>
        </form>
      </div>
    )
  }
}

export default MnemonicAsset;