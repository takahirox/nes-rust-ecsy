const path = require('path');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");

module.exports = {
  entry: "./src/bootstrap.js",
  output: {
    library: 'app',
    publicPath: "dist/",
    path: path.resolve(__dirname, "dist"),
    filename: "nes_rust_wasm_ecsy.js",
  },
  mode: "development",
  plugins: [
    new EsmWebpackPlugin()
  ],
};
