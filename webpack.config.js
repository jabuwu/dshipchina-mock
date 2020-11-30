const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  mode: production ? 'production' : 'development',
  optimization: production ? undefined : {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    noEmitOnErrors: true
  },
  entry: production ? { index: './frontend/index.js' } : [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './frontend/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist/frontend'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            }
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ],
  },
  plugins: production ? [
    new CopyPlugin({
      patterns: [
        { from: 'frontend/index.html', to: 'index.html' },
      ],
    }),
    new VueLoaderPlugin(),
  ] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'frontend/index.html', to: 'index.html' },
      ],
    }),
    new VueLoaderPlugin(),
  ],
  devServer: {
    disableHostCheck: true,
  }
};
