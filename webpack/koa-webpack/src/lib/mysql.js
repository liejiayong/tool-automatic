const mysql = require('mysql')
const { database } = require('../config/default')
const model = require('../models/table/index')

// 创建连接池
const pool = mysql.createPool({
    host: database.HOST,
    user: database.USERNAME,
    password: database.PASSWORD,
    database: database.DATABASE
})

// 查询
const query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
            } else {
                conn.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 连接不再使用，返回到连接池
                    conn.release()
                })
            }
        })
    })
}

// 创建表fn
const createTable = sql => query(sql, [])

// 建表
model(createTable)

module.exports = {
    query,
    createTable
}
