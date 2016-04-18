/*eslint no-unused-vars: ["warn", { "varsIgnorePattern": "reactify" }]*/
/*eslint no-console: "off"*/

var babelify   = require('babelify'),
    browserify = require('browserify'),
    eslint     = require('gulp-eslint'),
    gulp       = require('gulp'),
    notify     = require('gulp-notify'),
    sass       = require('gulp-sass'),
    server     = require('./gulp/server'),
    source     = require('vinyl-source-stream');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('browserify', function() {
    browserify('./src/js/index.js', {
        transform: [[babelify, {
            presets: ["es2015"],
            global: true
        }]]
    }).bundle()
        .on('error', handleErrors)
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify("JS compiling finished!"));
});

gulp.task('lint', function() {
    return gulp.src(['gulpfile.js', 'src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css/'));
    gulp.src('src/img/*.*')
        .pipe(gulp.dest('dist/img'));
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('server', function() {
    server.start(function() {
        console.log('Server listening to', server.port);
    });
});

gulp.task('default', ['lint', 'browserify', 'copy', 'server'], function() {
    return gulp.watch('src/**/*.*', ['lint', 'browserify', 'copy']);
});
