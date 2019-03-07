import React, { Component } from 'react';
import { Button } from './core/buttons';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  filename: '',
  keystore: null,
  password: ''
}


class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
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
      self.setState({ filename: file.name, keystore: JSON.parse(read.result) });
    }
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
    this.props.done({
      subType: 'keystore',
      asset: {
        keystore: this.state.keystore,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <div>
        <h3>Keystore</h3>
        <p className='type not-recommended'>This is not a recommended way to access your wallet.</p>
        <p></p>

        <div>
          <span className={cx("label", "mt-3", "d-block")}>Upload keystore</span>
          <input id="keystore-file" type="file" accept="application/json" onChange={this.handleChangeFile} style={{ "display": "none" }} />
          <input type="text" value={this.state.filename} style={{ "width": "420px", "marginRight": "14px" }} disabled />
          <Button
            type="primary"
            size="sm"
            onClick={() => { document.getElementById('keystore-file').click(); }}
          >Browse</Button>

          <span className={cx("label", "mt-3", "d-block")}>Enter password</span>
          <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
        </div>

        <Button
          type="primary"
          size="sm"
          customStyle={{ "float": "right", "marginTop": "24px", "width": "170px" }}
          onClick={this.handleSubmit}
        >OK</Button>
      </div>

    )
  }
}

export default KeystoreAsset;