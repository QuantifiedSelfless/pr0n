/*eslint no-unused-vars: ["warn", { "varsIgnorePattern": "reactify" }]*/

var babelify   = require('babelify'),
    browserify = require('browserify'),
    eslint     = require('gulp-eslint'),
    gulp       = require('gulp'),
    reactify   = require('reactify'),
    source     = require('vinyl-source-stream');

gulp.task('browserify', function() {
    browserify('./src/js/main.js')
        .transform('reactify')
        .transform(babelify, {
            presets: ["es2015"],
            global: true
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('lint', function() {
    return gulp.src(['gulpfile.js', 'src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/css/romance.css')
        .pipe(gulp.dest('dist'));
    gulp.src('src/css/gamecss.css')
        .pipe(gulp.dest('dist'));
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('default', ['lint', 'browserify', 'copy'], function() {
    return gulp.watch('src/**/*.*', ['lint', 'browserify', 'copy']);
});
