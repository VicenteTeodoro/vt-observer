const path = require('path');

module.exports = {
  entry: './src/mngr.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './',
    compress: true,
    port: 9000,
    open: true
  }
}; 