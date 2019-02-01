import React, { Component } from 'react';

class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      subType: 'keystore',
      value: null
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible)
      this.setState({ visible: this.props.visible });
  }


  render() {
    if (!this.props.visible) return null;
    return (
      <div>
        <p>KeystoreAsset</p>
      </div>
    )
  }
}

export default KeystoreAsset;