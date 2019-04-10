"use strict";

const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  externals: {
    jquery: "jQuery",
    raphael: "Raphael"
  },
  mode: "production",
  module: {
    rules: [
      {loader: "babel-loader", test: /\.ts/},
      {loader: "babel-loader", test: /\.js/}
    ]
  },
  node: {
    fs: "empty"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  resolve: {
    extensions: [".js", ".ts"]
  }
};
