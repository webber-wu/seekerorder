const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  externals: {
    './cptable': 'var cptable',
    '../xlsx.js': 'var _XLSX',
  },
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    port: 9000,
    open: true,
  },
});
