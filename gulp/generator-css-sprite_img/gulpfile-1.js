const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');

const terminal = 'pc' // pc | mobile
const baseUrl = ''; // gulp雪碧图插件：根据图片导出图路径
const imgUrl = `${baseUrl}`;
function pixelUnit(width, symbol = terminal === 'pc' ? 'px' : 'rem') {
  if (terminal === 'pc') return width;

  var str = (width + '').replace(/px$/gi, '');
  var len = str.length;
  var ret = 0;
  if (len === 1 && +str === 0) ret = 0;
  else if (len === 1 && +str !== 0) ret = `0.0${str}${symbol}`;
  else if (len === 2) ret = `0.${str}${symbol}`;
  else if (len >= 3) ret = str.replace(/(?=\d{2}$)/, '.') + symbol;
  return ret;
}

// 操作css文件
/**
 *  如果是一个任务处理多文件夹的话，
 *  只要声明不同的变量，
 *  然后return merge(xx, xx)合并返回即可
 *  如下 style 任务
 */
gulp.task('style', function () {
  const scssIndex = gulp
    .src('scss/style.scss') // 需要编译scss的文件
    .pipe(
      sass({ outputStyle: 'compact' }) // 压缩格式：nested(嵌套)、compact（紧凑）、expanded（扩展）、compressed（压缩）
        .on('error', sass.logError)
    )
    .pipe(cssnano()) // css压缩
    .pipe(gulp.dest('dist')) // 输出路径
    .pipe(browsersync.stream()); // 文件有更新自动执行
  return merge(scssIndex);
});

//监听scss文件
gulp.task('serve', function () {
  gulp.start('style');
  gulp.watch('scss/*.scss', ['style']);
});

// 雪碧图
gulp.task('spritejs', function () {
  gulp
    .src('img/*')
    .pipe(
      spritesmith({
        imgName: 'iconsprite.png', //保存合并后图片的地址
        cssName: 'iconsprite_name.js', // 保存合并后对于css样式的地址
        padding: 10, //合并时两个图片的间距
        algorithm: 'binary-tree', // 注释1
        cssTemplate: data => {
          const imgList = [];
          data.sprites.forEach(function (sprite) {
            const source = sprite.source_image;
            const name = sprite.name;
            const ext = source.replace(/^\w+.(\w+)$/g, '$1');
            imgList.push(`${imgUrl}${name}${ext}`)
            imgList.push(imgUrl + name + ext);
          });

          const IMG_LIST = 'var IMGLIST =' + JSON.stringify(imgList) + ';';
          return IMG_LIST;
        }
      })
    )
    .pipe(gulp.dest('dist'));
});
gulp.task('spritecss', function () {
  gulp
    .src('img/*')
    .pipe(
      spritesmith({
        imgName: 'iconsprite.png', // 保存合并后图片的地址
        cssName: '_iconsprite.scss', // 保存合并后对于css样式的地址
        padding: 10, // 合并时两个图片的间距
        algorithm: 'binary-tree', // 注释1
        cssTemplate: function (data) {
          var arr = [];
          data.sprites.forEach(function (sprite) {
            arr.push(
              '.' + sprite.name + '{' + "background-size: " + pixelUnit(sprite.total_width) + ' ' + pixelUnit(sprite.total_height) + ";background-image: url('../img/" + sprite.escaped_image + "');" + 'background-position: ' + pixelUnit(sprite.px.offset_x) + ' ' + pixelUnit(sprite.px.offset_y) + ';' + 'width:' + pixelUnit(sprite.px.width) + ';' + 'height:' + pixelUnit(sprite.px.height) + ';' + '}\n'
            );
          });
          return arr.join('');
        }
      })
    )
    .pipe(gulp.dest('scss'));
});

//编译scss文件：gulp default
gulp.task('default', ['spritejs', 'spritecss', 'serve']);
