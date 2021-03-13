module.exports = function (app) {
    // 注册
    app.use(require('./signup').routes())
}