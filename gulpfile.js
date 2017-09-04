var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('package', function() {
    return gulp.src(['./**/*', '!doc/**', '!doc'])
        .pipe(zip('HMIS_Dictionary.zip'))
        .pipe(gulp.dest('target'));
});