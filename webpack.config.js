const path = require('path');


module.exports = {
  entry: './exports.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // localIdentName: '[local]--[hash:base64:5]'
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader'
      },
    ]
  },
  resolve: {
    alias: {
      Style: path.resolve(__dirname, 'wallet/skin/static/styles/')
    }
  },
  node: {
    fs: 'empty'
  },
  mode: 'production'
};