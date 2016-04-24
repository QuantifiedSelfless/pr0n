/*eslint no-unused-vars: ["warn", { "varsIgnorePattern": "reactify" }]*/
/*eslint no-console: "off"*/

var babelify   = require('babelify'),
    browserify = require('browserify'),
    envify     = require('envify'),
    eslint     = require('gulp-eslint'),
    gulp       = require('gulp'),
    notify     = require('gulp-notify'),
    sass       = require('gulp-sass'),
    source     = require('vinyl-source-stream')
    exec       = require('child_process').exec;

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('build', ['copy'], function() {
    browserify('./src/js/index.js', {
        transform: [[envify, {}], [babelify, {
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
  console.log("Starting server! Good luck everyone!");
  exec('./run.sh', function() {
    console.log("Server stopped :(");
  });
});

gulp.task('default', ['lint', 'build', 'server'], function() {
    return gulp.watch('src/**/*.*', ['lint', 'browserify', 'copy']);
});
