const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

var nodeModules = {}
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod
    })

module.exports = {
    entry: {
        main: [
            'webpack-hot-middleware/client?noInfo=true&reload=true', // 生产环境的入口建议把这个去掉
            './src/index.js'
        ]
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/'
    },
    // 解决指向问题 ， 打包之后的代码你会发现 __durname __filename 全部都是 / 
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'node',
    externals: nodeModules,
    // module: {
    //     // 在低版本node可以转换支持es6789
    //     loaders: [{
    //         test: /\.js$/,
    //         loader: 'babel-loader',
    //         exclude: [
    //             path.resolve(__dirname, "node_modules"),
    //         ],
    //         query: {
    //             plugins: ['transform-runtime'],
    //             presets: ['es2015', 'stage-0'],
    //         }
    //     }]
    // },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        // // 使用koa-webpack 时不需要 引用
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
