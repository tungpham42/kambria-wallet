import React, { Component } from 'react';

class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      subType: 'ledger-nano-s',
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
        <p>LedgerNanoSAsset</p>
      </div>
    )
  }
}

export default LedgerNanoSAsset;