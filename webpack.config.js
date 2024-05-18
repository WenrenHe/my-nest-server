/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

console.log('start build')
module.exports = {
  mode: 'production',
  entry: './src/main',
  target: 'node',
  externals: {},
  module: {
    rules: [
      {
        test: /.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 默认是 async，可选值有 async、initial 和 all，all 会把所有 node_modules里的东西栋放到一个叫vendors~main.js的文件
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
          '@nestjs/websockets/socket-module',
          'class-transformer/storage',
          'yamlparser',
        ]
        if (!lazyImports.includes(resource)) {
          return false
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          })
        } catch (err) {
          return true
        }
        return false
      },
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
}
