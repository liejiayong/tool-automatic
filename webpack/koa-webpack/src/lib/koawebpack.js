const webpack = require('webpack'),
  koaWebpack = require('koa-webpack'),
  config = require('../../webpack.config')

// 热更新方法一：koa-webpack
module.exports = async app => {
  try {
    const compiler = webpack(config),
      middleware = await koaWebpack({ compiler })
    app.use(middleware)
  } catch (err) {
    console.error('koa-webpack complied err:', err)
  }
}
