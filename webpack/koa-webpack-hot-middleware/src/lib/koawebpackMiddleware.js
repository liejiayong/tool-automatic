const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const config = require('../../webpack.config')

// 热更新方法二：koa-webpack-dev-middleware + koa-webpack-hot-middleware
module.exports = async app => {
  try {
    const compiler = webpack(config)
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true
    }))
    app.use(webpackHotMiddleware(compiler))
  } catch (err) {
    console.error('koa-webpack-hot-middleware complied err:', err)
  }
}
