const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  // 简单单文件
  // entry: './src/index.js',
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, 'dist')
  // },
  // 命名多文件
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  },
  optimization: {
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.css$/, // webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这个示例中，所有以 .css 结尾的文件，都将被提供给 style-loader 和 css-loader。
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  },
  devtool: 'inline-source-map', // 为了更容易地追踪 error 和 warning，JavaScript 提供了 source map 功能，可以将编译后的代码映射回原始源代码。
  // webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：
  // webpack watch mode(webpack 观察模式)
  // webpack-dev-server
  // webpack-dev-middleware
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true, // 热加载
    open: true // 启动后打开浏览器,可设置默认浏览器open: 'Google Chrome'
  },
  plugins: [
    new CleanWebpackPlugin(), // 每次打包前清除前包
    new HtmlWebpackPlugin({
      title: 'webpack test'
    })
  ]
}
