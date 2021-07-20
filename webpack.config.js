const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: "static",
        to: ""
      }, ],
    }),
  ],
};