const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MODE = process.env.MODE;
/*
const config = {
    entry: {
        'app': './src/index.js'
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
*/
/*
const config = {
    entry: {
        'mage': './src/index.js'
    },
    output: {
        library: 'M',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        umdNamedDefine: true
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
                    presets: ['es2015', 'stage-0'],
                    plugins: [["babel-plugin-inferno", {"imports": true}]]
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
    target: 'web'
};

module.exports = config;
*/


const TerserPlugin = require('terser-webpack-plugin');

// Uncomment if you want to run the bundle analyzer
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'production',
    cache:   false,
    devtool: false,
    entry: {
        'app': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
        // Uncomment if you want to run the bundle analyzer
        // new BundleAnalyzerPlugin(),
    ]
};
