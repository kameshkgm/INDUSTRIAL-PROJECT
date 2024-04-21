// webpack.config.js

const path = require('path');

module.exports = {
  // Your webpack configuration settings...

  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "url": require.resolve("url/"),
      "net": false, // Assuming you don't need a polyfill for net
      "tls": false, // Assuming you don't need a polyfill for tls
      "assert": require.resolve("assert/"),
      "stream": require.resolve("stream-browserify")
    }
  }
};
