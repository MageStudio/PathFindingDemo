const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MODE = process.env.MODE;

const config = {
    entry: {
        'mage': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
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
    target: 'web'
};

module.exports = config;
