import React, { Component } from 'react';
import { Button } from './core/buttons';


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
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    if (!this.props.visible) return null;
    return (
      <div>
        <form>
          <h3>Seed</h3>
          <p className='type recommended'>This is a recommended way to access your wallet.</p>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

          <div>
            <span className="label mt-3 d-block">Enter seed</span>
            <input type="text" value={this.state.mnemonic} onChange={this.handleChangeMnemonic} />

            <span className="label mt-3 d-block">Enter password (Optional)</span>
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