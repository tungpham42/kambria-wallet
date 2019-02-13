import React, { Component } from 'react';
import { Button } from './core/buttons';

const DEFAULT_STATE = {
  privateKey: ''
}


class PrivateKeyAsset extends Component {
  constructor(props) {
    super(props);

    console.log('=======')

    this.state = {
      ...DEFAULT_STATE
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ privateKey: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.returnData2Parent();

    // Clear history
    this.setState(DEFAULT_STATE);
  }

  returnData2Parent() {
    return this.props.done({
      subType: 'private-key',
      asset: {
        privateKey: this.state.privateKey
      }
    });
  }

  render() {
    return (
      <div>
        <form>
          <h3>Seed</h3>
          <p className='type not-recommended'>This is not a recommended way to access your wallet.</p>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

          <div>
            <span className="label mt-3 d-block">Enter private key</span>
            <input type="text" value={this.state.privateKey} onChange={this.handleChange} />
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

export default PrivateKeyAsset;