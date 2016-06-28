/*eslint no-console: 0*/
var webpack = require('webpack')
var path = require('path')

module.exports = function (config) {
  if (process.env.RELEASE)
    config.singleRun = true

  var customLaunchers = {
    // Browsers to run on BrowserStack.
    BS_Chrome: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'chrome',
      browser_version: 'latest'
    },
    BS_Firefox: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'firefox',
      browser_version: 'latest'
    }
  }

  var isCi = process.env.CONTINUOUS_INTEGRATION === 'true'
  var runCoverage = process.env.COVERAGE === 'true' || isCi

  var coverageLoaders = []
  var coverageReporters = []

  if (runCoverage) {
    coverageLoaders.push({
      test: /\.js$/,
      include: path.resolve('modules/'),
      exclude: /__tests__/,
      loader: 'isparta'
    })

    coverageReporters.push('coverage')
  }

  config.set({
    customLaunchers: customLaunchers,

    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ].concat(coverageReporters),

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ].concat(coverageLoaders)
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    },

    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' }
      ]
    }
  })

  if (process.env.USE_CLOUD) {
    config.browsers = Object.keys(customLaunchers)
    config.reporters[0] = 'dots'
    config.captureTimeout = 300000,  // 5 mins
    config.browserNoActivityTimeout = 300000  // 5 mins
    config.browserDisconnectTimeout = 300000  // 5 mins
    config.browserDisconnectTolerance = 3

    if (process.env.TRAVIS) {
      var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'

      config.browserStack = {
        username: process.env.BROWSER_STACK_USERNAME,
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        pollingTimeout: 10000,
        startTunnel: true,
        project: 'react-router',
        build: buildLabel,
        name: process.env.TRAVIS_JOB_NUMBER
      }

      config.singleRun = true
    } else {
      config.browserStack = {
        username: process.env.BROWSER_STACK_USERNAME,
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        pollingTimeout: 10000,
        startTunnel: true
      }
    }
  }
}
