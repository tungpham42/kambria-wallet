## Introduction

This module is a build-in zero client node as Metamask. It's supporting most of basic functions 
such as account management, transacion, contract, ...  With some restrictions of browser, the module will serve fully functions in Chrome and partly in the other browsers.

## Prerequisite

Install node modules

```
npm install
```

## The structure

The `wallet` folder contains the main source code.

The `src` folder contains test files. However, it can be viewed as an example, so
to know how to use them, you can refer to `src/*` for details.

## How to build library?

```
npm run build
```

## How to test?

### Unit test

```
Not yet
```

### UI test

```
npm test
```

The app will be run on port 5000 with https, if browser aks something, please trust it and process straight forward.

*Notice that it is not supported hot-reloading outside `/src`, so you should re-run `npm test` manually for any code chaging.*

## How to use for production?

### Prequisitions (In case, you want to install web3 by yourself)

* Install web3: ***Must be 0.20.x verison.***

```
npm install web3@0.20.6
```

* Build library (if the `dist` folder or `index.js` in root doesn't exist).
  
```
npm run build
```

### Utility

The `dist` folder contains all you need for creating your client node.

* Using the lib by:
```
import {Metamask, Kammask} from '@kambria/wallet';
```
Or copy that, put it somewhere in your project and import it to use. You can refer the examples in the `src` folder for the detail.


### Examples

Let's observe the `src` folder

## Cheatsheet

| # | Commands | Descriptions |
| :-: | - | - |
| 1 | `npm install` | Install module packages |
| 2 | `npm run build` | Build javascript libraries |
| 3 | `npm test` | Run ui test |