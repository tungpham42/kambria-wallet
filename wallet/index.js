import React, { Component } from 'react';

var Metamask = require('./metamask');
var Isoxys = require('./isoxys');

const CONST = require('./const');


class Wallet extends Component {

  constructor(net) {
    super();

    this.net = net;
    this.type = null;
  }

  render() {
    return (
      <div>
        <h1>Ok: {this.net}</h1>
      </div>
    );
  }

}

export default Wallet;