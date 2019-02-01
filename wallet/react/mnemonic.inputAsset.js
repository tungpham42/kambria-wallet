import React, { Component } from 'react';

class MnemonicAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      mnemonic: null,
      password: null
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

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible)
      this.setState({ visible: this.props.visible });
  }

  render() {
    if (!this.props.visible) return null;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> Mnemonic
          <input type="text" value={this.state.mnemonic} onChange={this.handleChangeMnemonic} />
          </label>
          <label> Password (optional)
          <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default MnemonicAsset;