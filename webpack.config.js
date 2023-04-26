const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

function getGameNavPageConfig(roms) {
  return {
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    output: {
      // clean: true,
      path: path.resolve('./dist')
    },
    // mode: 'production',
    entry: {
      index: './src/index.js',
      loader: './src/loader.js'
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {from: 'roms'},
          {from: 'public'}
        ]
      }),
      new HtmlWebpackPlugin({
        template: 'src/game-nav.ejs',
        filename: 'index.html',
        templateParameters: {roms}
      }),
      ...roms.map(i => {
        return new HtmlWebpackPlugin({
          template: 'src/gaming.ejs',
          filename: `${i}.html`,
          templateParameters: {rom: i},
          chunks: ['loader']
        });
      }),
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true,
      }),
    ]
  };
}


module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve('./roms'), {}, (err, roms) => {
      if (err) {
        reject(err);
        return;
      }
      resolve([
        getGameNavPageConfig(roms)
      ])
    });
  });
}

