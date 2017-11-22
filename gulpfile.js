var gulp = require('gulp');
  zip = require('gulp-zip');
  browserSync = require('browser-sync').create(),
  gulpsync    = require('gulp-sync')(gulp),
  proxy       = require('http-proxy-middleware'),

APP = {
  src: {
    root: ".",
    all: "**/**/*.*",
  },
};

TASKS = {
  watchSrc: '_watchSrc',
  cleanTemp: '_cleanTemp',
  clean: 'clean',
  serve: 'serve',
  copyResourcesToTemp: '_copyResourcesToTemp',
  setUpTemp: '_setUpTemp',
  reload: '_reload',
  webpackTest: '_webpackTest',
  pack: 'pack',
};

gulp.task(TASKS.reload, function() {
  browserSync.reload();
});

gulp.task(TASKS.watchSrc, function() {
  gulp.watch([APP.src.all], gulpsync.sync([TASKS.reload]));
});

gulp.task(TASKS.serve, function() {
  browserSync.init({
    port: 8000,
    server: {
      port: 8000,
      baseDir: APP.src.root,
      middleware: [proxy(['/api', '/dhis-web-commons', '/icons'], {target: 'http://localhost:8080'})]
    }

  });
});

gulp.task(TASKS.pack, function() {
  return gulp.src(['./**/*', '!doc/**', '!doc'])
    .pipe(zip('ca-his-dictionary.zip'))
    .pipe(gulp.dest('target'));
});

gulp.task('default', [TASKS.serve, TASKS.watchSrc]);
