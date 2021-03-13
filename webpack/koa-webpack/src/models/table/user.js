// 用户
exports.user = `create table if not exists users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    pass VARCHAR(100) NOT NULL COMMENT '密码',
    avator VARCHAR(100) NOT NULL COMMENT '头像',
    moment VARCHAR(100) NOT NULL COMMENT '注册时间',
    PRIMARY KEY ( id )
   );`