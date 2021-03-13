// 表结构

// 用户
const users = `create table if not exists users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    pass VARCHAR(100) NOT NULL COMMENT '密码',
    avator VARCHAR(100) NOT NULL COMMENT '头像',
    moment VARCHAR(100) NOT NULL COMMENT '注册时间',
    isdel 
    PRIMARY KEY ( id )
   );`

// 文章
const posts = `create table if not exists posts(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '文章作者',
    title TEXT(0) NOT NULL COMMENT '评论题目',
    content TEXT(0) NOT NULL COMMENT '评论内容',
    md TEXT(0) NOT NULL COMMENT 'markdown',
    uid VARCHAR(40) NOT NULL COMMENT '用户id',
    moment VARCHAR(100) NOT NULL COMMENT '发表时间',
    comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
    pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
    avator VARCHAR(100) NOT NULL COMMENT '用户头像',
    PRIMARY KEY(id)
   );`

// 评论
const comments = `create table if not exists comment(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名称',
    content TEXT(0) NOT NULL COMMENT '评论内容',
    moment VARCHAR(40) NOT NULL COMMENT '评论时间',
    postid VARCHAR(40) NOT NULL COMMENT '文章id',
    avator VARCHAR(100) NOT NULL COMMENT '用户头像',
    PRIMARY KEY(id) 
   );`

module.exports = {
    users,
    posts,
    comments
}
