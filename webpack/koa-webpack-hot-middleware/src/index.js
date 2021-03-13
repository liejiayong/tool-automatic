const http = require('http')
const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
const router = require('./router')
const { HTTP_SERVER_PORT } = require('./config/default')
const staticPath = '/cachefile'

const app = new Koa()

// 配置静态资源加载
// app.use(koaStatic(path.join(__dirname, staticPath)))
app.use(staticCache(path.join(__dirname, staticPath), { dynamic: true }, { maxAge: 365 * 24 * 60 * 60 }))

// 配置服务器路由请求
app.use(bodyParser({ formLimit: '1mb' }))

// 路由
router(app)

// 热更新
// 方法二：koa-webpack-dev-middleware + koa-webpack-hot-middleware
const koawebpackMiddleware = require('./lib/koawebpackMiddleware')
koawebpackMiddleware(app)

http.createServer(app.callback()).listen(HTTP_SERVER_PORT)
console.log(`http server listening on port ${HTTP_SERVER_PORT}`)
