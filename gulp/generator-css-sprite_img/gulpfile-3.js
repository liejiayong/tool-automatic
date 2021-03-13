const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');

// gulp雪碧图插件：根据图片导出图路径
const IMG_TYPE = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF'];
const baseUrl = '';
const imgUrl = `${baseUrl}`;
const terminal = 'h5'; // pc or h5
var isPrite = true;

gulp.task('spritecss', function () {
  gulp
    .src('img/*')
    .pipe(
      spritesmith({
        imgName: 'menu.png', //保存合并后图片的地址
        cssName: 'skill-sprite.css', //保存合并后对于css样式的地址
        padding: 50, //合并时两个图片的间距
        algorithm: 'binary-tree', //注释1
        cssTemplate: function (data) {
          var arr = [];
          data.sprites.forEach(function (sprite) {
            if (isPrite) {
              // 图片雪碧图
              let txt = '';
              if (terminal == 'pc') {
                txt =
                  '.' +
                  sprite.name +
                  '{display:inline-block' +
                  `;background: url("../img/${sprite.escaped_image}") no-repeat ${sprite.px.offset_x} ${sprite.px.offset_y} / ${sprite.px.total_width} auto` +
                  ';width:' +
                  sprite.px.width +
                  ';height:' +
                  sprite.px.height +
                  ';}\n';
              } else {
                txt =
                  '.' +
                  sprite.name +
                  '{display:inline-block' +
                  `;background: url("../img/${sprite.escaped_image}") no-repeat ${px2rem(sprite.px.offset_x)} ${px2rem(sprite.px.offset_y)} / ${px2rem(sprite.total_width)} auto` +
                  ';width:' +
                  px2rem(sprite.px.width) +
                  ';height:' +
                  px2rem(sprite.px.height) +
                  ';}\n';
              }
              arr.push(txt);
            } else {
              // 图片单独数据
              // img name
              const name = sprite.name,
                source = sprite.source_image,
                imgName = source.substr(source.indexOf(name));
              let singleSty = '',
                width = '',
                height = '';

              if (terminal == 'pc') {
                width = sprite.px.width;
                height = sprite.px.height;

                singleSty = `.${name}{display:inline-block;width: ${width}; height: ${height}; background: url("../img/${imgName}") no-repeat;}\n`;
              } else {
                (width = getPixel({ width: sprite.width, type: terminal })), (height = getPixel({ width: sprite.height, type: terminal }));
                singleSty = `.${name}{display:inline-block;width: ${width}; height: ${height}; background: url("../img/${imgName}") no-repeat 0 0 / ${width} auto;}\n`;
              }
              arr.push(singleSty);
            }
          });
          return arr.join('');
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
        imgName: 'sprite.png',
        imgPath: 'sp.png',
        cssName: 'imgList.js',
        cssTemplate: data => {
          const imgList = [];
          data.sprites.forEach(function (sprite) {
            const source = sprite.source_image;
            const name = sprite.name;
            console.log(sprite);
            const ext = source.replace(/.+\.(\w+)$/g, '$1');
            imgList.push(`${imgUrl}${name}.${ext}`);
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

function px2rem(width, symbol = 'rem') {
  var str = (width + '').replace(/px$/gi, '');
  var len = str.length;
  var ret = 0;
  if (len === 1 && +str === 0) ret = 0;
  else if (len === 1 && +str !== 0) ret = `0.0${str}${symbol}`;
  else if (len === 2) ret = `0.${str}${symbol}`;
  else if (len >= 3) ret = str.replace(/(?=\d{2}$)/, '.') + symbol;
  return ret;
}

function getPixel({ width, type = 'h5', symbol = 'rem' }) {
  let ret = '';

  switch (type) {
    case 'h5':
      ret = px2rem(width, symbol);
      break;
    case 'pc':
      ret = width;
    default:
      ret = width;
      break;
  }

  return ret;
}

function setImgType(src = '', typeList = []) {
  if (!src.length) return;
  let type = '';
  typeList.forEach(t => {
    if (src.lastIndexOf(t) > -1) {
      type = t;
    }
  });
  return `.${type}`;
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
    .src('scss/*.scss') // 需要编译scss的文件
    .pipe(
      sass({ outputStyle: 'compact' }) // 压缩格式：nested(嵌套)、compact（紧凑）、expanded（扩展）、compressed（压缩）
        .on('error', sass.logError)
    )
    .pipe(cssnano()) // css压缩
    .pipe(gulp.dest('src/css')) // 输出路径
    .pipe(browsersync.stream()); // 文件有更新自动执行

  const scssComponents = gulp
    .src('scss/scss-components/*.scss') // 需要编译scss的文件
    .pipe(
      sass({ outputStyle: 'compact' }) // 压缩格式：nested(嵌套)、compact（紧凑）、expanded（扩展）、compressed（压缩）
        .on('error', sass.logError)
    )
    .pipe(cssnano()) // css压缩
    .pipe(gulp.dest('src/css/css-components')) // 输出路径
    .pipe(browsersync.stream()); // 文件有更新自动执行
  return merge(scssIndex, scssComponents);
});

// //监听scss文件
// gulp.task('serve', function() {
// 	gulp.start('style')
// 	gulp.watch('scss/*.scss', ['style'])
// })
