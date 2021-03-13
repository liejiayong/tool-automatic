const moment = require('moment')
const fs = require('fs')
const path = require('path')
const { findDataByName, registerUser } = require('../models/user')

exports.postSignup = async ctx => {
    try {
        let { name, password, repeatpass, avator } = ctx.request.body
        await findDataByName(name).then(async res => {
            // 用户存在
            if (res.length) {
                ctx.body = {
                    code: 0,
                    msg: '用户已存在'
                }
            }
            // 密码
            else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 0,
                    msg: '两次输入的密码不一致'
                }
            }
            // 头像
            else if (avator && avator.trim() === '') {
                ctx.body = {
                    code: 0,
                    msg: '请上传头像'
                }
            }
            // 密码
            else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 0,
                    msg: '两次输入的密码不一致'
                }
            }
            else {
                let base64Data = avator.replace(/^data:image\/\w+;base64,/, ''),
                    dataBuffer = new Buffer.from(base64Data, 'base64'),
                    avatarName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
                    upload = await new Promise((reslove, reject) => {
                        const dirpath = path.join(__dirname, '../../cachefile')
                        if (!fs.existsSync(dirpath)) {
                            fs.mkdirSync(dirpath)
                        }
                        fs.writeFile(`./cachefile/${avatarName}.jpg`, dataBuffer, err => {
                            if (err) {
                                reject(false)
                                throw err
                            }
                            reslove(true)
                            console.log('头像上传成功')
                        })
                    })
                if (upload) {
                    const val = [name, password, `${avatarName}.jpg`, moment().format('YYYY-MM-DD HH:mm:ss')]
                    await registerUser(val).then(reg => {
                        console.log('注册成功', reg)
                        //注册成功
                        ctx.body = {
                            code: 1,
                            message: '注册成功'
                        }
                    })
                } else {
                    console.log('头像上传失败')
                    ctx.body = {
                        code: 0,
                        message: '头像上传失败'
                    }
                }
            }

        })
    } catch {
        ctx.body = {
            code: 0,
            msg: '请输入正确信息'
        }
    }
}