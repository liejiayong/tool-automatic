const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const { CONFIG_TERMINAL, getImg2CssWap, getImg2CssPC } = require('./util');

// gulp雪碧图插件：根据图片导出图路径
const cssPath = `../img/`; // 生成css图片的路径
const jsPath = ``; // 生成js图片名称数组的路径
const CONFIG = {
  terminal: CONFIG_TERMINAL.wap, // pc or wap
  isSprite: false, // 是否生成雪碧图
  cssFsName: 'sprite.css', // 保存合并后对于css样式的地址
  cssImgName: 'ico-signle.png', // 保存合并后图片的地址
  spriteImgGutter: 60, // 合并时两个图片的间距
  jsFsName: 'sprite.js',
  jsImgName: 'js.png',
};

gulp.task('spritecss', function () {
  gulp
    .src('img/*')
    .pipe(
      spritesmith({
        cssName: CONFIG.cssFsName,
        imgName: CONFIG.cssImgName,
        padding: CONFIG.spriteImgGutter,
        algorithm: 'binary-tree', // 注释1
        cssTemplate: function (data) {
          // 移动端
          if (CONFIG.terminal == CONFIG_TERMINAL.wap) {
            return getImg2CssWap(data, CONFIG.isSprite, cssPath);
          }
          // PC端
          else if (CONFIG.terminal == CONFIG_TERMINAL.pc) {
            return getImg2CssPC(data, CONFIG.isSprite, cssPath);
          }
        },
      })
    )
    .pipe(gulp.dest('js'));
});

gulp.task('spritejs', function () {
  gulp
    .src('img/*')
    .pipe(
      spritesmith({
        cssName: CONFIG.jsFsName,
        imgName: CONFIG.jsImgName,
        imgPath: '',
        cssTemplate: data => {
          const imgList = [];
          data.sprites.forEach(function (sprite) {
            const source = sprite.source_image;
            const name = sprite.name;
            console.log(sprite);
            const ext = source.replace(/.+\.(\w+)$/g, '$1');
            imgList.push(`${jsPath}${name}.${ext}`);
          });

          const IMG_LIST = 'var IMGLIST =' + JSON.stringify(imgList) + ';';
          return IMG_LIST;
        },
      })
    )
    .pipe(gulp.dest('js'));
});

//编译scss文件：gulp default
// gulp.task('default', ['spritejs', 'spritecss', 'serve'])
gulp.task('default', ['spritejs', 'spritecss']);

/**
 *  如果是一个任务处理多文件夹的话，
 *  只要声明不同的变量，
 *  然后return merge(xx, xx)合并返回即可
 *  如下 style 任务
 */
// const sass = require('gulp-sass')
// const browsersync = require('browser-sync').create()
// const cssnano = require('gulp-cssnano')
// const merge = require('merge-stream')
// 操作css文件
// gulp.task('style', function() {
// 	const scssIndex = gulp
// 		.src('scss/*.scss') // 需要编译scss的文件
// 		.pipe(
// 			sass({ outputStyle: 'compact' }) // 压缩格式：nested(嵌套)、compact（紧凑）、expanded（扩展）、compressed（压缩）
// 				.on('error', sass.logError)
// 		)
// 		.pipe(cssnano()) // css压缩
// 		.pipe(gulp.dest('src/css')) // 输出路径
// 		.pipe(browsersync.stream()) // 文件有更新自动执行

// 	const scssComponents = gulp
// 		.src('scss/scss-components/*.scss') // 需要编译scss的文件
// 		.pipe(
// 			sass({ outputStyle: 'compact' }) // 压缩格式：nested(嵌套)、compact（紧凑）、expanded（扩展）、compressed（压缩）
// 				.on('error', sass.logError)
// 		)
// 		.pipe(cssnano()) // css压缩
// 		.pipe(gulp.dest('src/css/css-components')) // 输出路径
// 		.pipe(browsersync.stream()) // 文件有更新自动执行
// 	return merge(scssIndex, scssComponents)
// })

// //监听scss文件
// gulp.task('serve', function() {
// 	gulp.start('style')
// 	gulp.watch('scss/*.scss', ['style'])
// })
