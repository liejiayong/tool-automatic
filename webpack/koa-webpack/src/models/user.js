const { query } = require('../lib/mysql')

// 通过名字查找用户
exports.findDataByName = name => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}

// 注册用户
exports.registerUser = value => {
    let _sql = 'insert into users set name=?,pass=?,avator=?,moment=?;'
    return query(_sql, value)
}