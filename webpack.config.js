const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MODE = process.env.MODE;
const CopyPlugin = require('copy-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    cache:   false,
    devtool: false,
    entry: {
        'app': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'app.js',
    },
    module:  {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [/node_modules/, /static/]
        }]
    },
    resolve: {
        modules: [
            'static',
            'src',
            'node_modules'
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    mangle: false,
                    keep_fnames: true
                }
            })
        ]
    },
    performance: {
        hints: false,
        maxAssetSize: 1000000,
        maxEntrypointSize: 800000,
    },
    plugins: [
        new CopyPlugin([
            { from: './index.html', to: './index.html' },
            { from: 'assets', to: 'assets' },
            { from: 'css', to: 'css' },
        ]),
    ],
};
