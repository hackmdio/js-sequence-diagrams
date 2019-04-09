"use strict";

const TerserPlugin = require('terser-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        'index': './src/jquery-plugin.ts',
        'index.min': './src/jquery-plugin.ts'
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'babel-loader'
            },
            {
                test: /\.js/,
                loader: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimizer: [new TerserPlugin({
            test: /\.min\.js$/
        })],
    },
    externals: {
        jquery: 'jQuery',
        raphael: 'Raphael'
    },
    node: {
        fs: 'empty'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    }
};