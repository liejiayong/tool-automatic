const router = require('koa-router')() /*引入是实例化路由** 推荐*/
const { postSignup } = require('../controls/signup')

router.post('/signup', postSignup)
router.get('/signup', postSignup)

module.exports = router
