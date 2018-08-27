const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = [
  {
    entry: "./app/javascript/app.js",
    output: {
      path: path.resolve(__dirname, 'build/app'),
      filename: "bundle.js"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }]
    },
    plugins : [
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            { from: './app/index.html', to: "index.html" }
        ])
    ]
  }
];
