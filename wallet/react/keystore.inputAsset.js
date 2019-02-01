import React, { Component } from 'react';

class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      keystore: null,
      password: null
    }

    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeFile(e) {
    var self = this;
    var file = e.target.files[0];
    var read = new FileReader();
    read.readAsText(file);
    read.onloadend = function () {
      self.setState({ keystore: JSON.parse(read.result) });
    }
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
      subType: 'keystore',
      asset: {
        keystore: this.state.keystore,
        password: this.state.password
      }
    });
  }

  render() {
    if (!this.props.visible) return null;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> Keystore
            <input type="file" accept="application/json" onChange={this.handleChangeFile} />
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default KeystoreAsset;