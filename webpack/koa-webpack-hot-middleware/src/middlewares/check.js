module.exports = {
    checkLogin (ctx) {
        if (!ctx.session || !ctx.session.user) {
            ctx.body = {
                code: 0,
                msg: '未登录',
                data: {}
            }
            return false
        }
        return true
    }
}