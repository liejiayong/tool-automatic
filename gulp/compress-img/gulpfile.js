var gulp = require('gulp');
var tinypngFree = require('gulp-tinypng-free');

gulp.task('tinypng', function (cb) {
  gulp.src('img/*').pipe(tinypngFree({})).pipe(gulp.dest('dist'));
});

gulp.task('default', ['tinypng']);
