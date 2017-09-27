const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  context: __dirname,
  target: 'web',
  entry: './dragon.js',
  output: {
    path: path.resolve(__dirname, './src/components/functions'),
    filename: 'dragon.min.js',
    library: 'dragon',
    libraryTarget: 'var',
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['es2015', { modules: false }]
        ],
      },
    }]
  },
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    }),
  ],
  devtool: 'source-map',
}