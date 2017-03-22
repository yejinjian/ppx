var path = require('path');
var webpack = require('webpack');
var projectRoot = path.resolve(__dirname, '../');
var component = path.join(projectRoot, 'component');
var env = process.env.NODE_ENV;
console.log(projectRoot);
var opts = {
  entry: {
    app: path.resolve(__dirname,'index.js')
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins:[
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true,
    //     conditionals: true,
    //     unused: true,
    //     comparisons: true,
    //     sequences: true,
    //     dead_code: true,
    //     evaluate: true,
    //     if_return: true,
    //     join_vars: true,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // })
  ]
};

if(env === 'dev'){
  opts.devtool ='eval';
}

module.exports = opts;