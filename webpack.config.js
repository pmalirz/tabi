const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    "config-page": './src/config-page/config-page.js',
    "background": './src/background/background.js',
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
  plugins: [    
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{from: 'assets/manifest.json', flatten: true }, {from: 'assets/icons/*', to: 'icons', flatten: true }]),
    new HtmlWebpackPlugin({  
      filename: 'config-page.html',
      template: 'src/config-page/config-page.html',
      chunks: ["config-page"]
    })
    
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react']   
          }   
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader', options: {
              includePaths: ['./node_modules', './node_modules/grommet/node_modules']
            }
          }
        ]
      }
    ]
  }
};