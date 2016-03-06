"use strict";
/*!
 * gulp
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    runsequence = require('run-sequence'),
    debug = require('gulp-debug');

var fileDiscriminator = '';

// Styles
gulp.task('styles', function() {
    return sass('src/styles/**/*.scss', { style: 'expanded' })
        .pipe(gulp.dest('dist/styles'))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'JS task complete' }));
});

// Video
gulp.task('video', function() {
    return gulp.src('src/video/**/*')
        .pipe(gulp.dest('app/video'))
        .pipe(notify({ message: 'Video task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('app/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('jquery', function() {
    return gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('dist/third-party/jquery'))
        .pipe(notify({ message: 'JQuery task complete' }));
});

gulp.task('bootstrap', function() {
    return gulp.src('node_modules/bootstrap/dist/!(fonts)/!(npm.js)')
        .pipe(gulp.dest('dist/third-party/bootstrap'))
        .pipe(notify({ message: 'Bootstrap task complete' }));
});

gulp.task('font-awesome', function() {
    return gulp.src('node_modules/font-awesome/+(css|fonts)/*')
        .pipe(gulp.dest('dist/third-party/font-awesome'))
        .pipe(notify({ message: 'Font Awesome task complete' }));
});

// bust cache
gulp.task('bust', function (done) {
    return cache.clearAll(done);
});

// Clean
gulp.task('clean', function() {
    del([
        'dist/*',
        'app/*']);
});

gulp.task('deploy-js', ['js'], function() {
    return gulp.src('dist/js/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/js'))
        .pipe(notify({ message: 'Deploy js complete' }));
});

gulp.task('deploy-css', ['styles'], function() {
    return gulp.src('dist/styles/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/css'))
        .pipe(notify({ message: 'Deploy css task complete' }));
});

gulp.task('deploy-third-party', function() {
    return gulp.src('dist/third-party/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/third-party'))
        .pipe(notify({ message: 'Deploy third-party task complete' }));
});

gulp.task('deploy-third-party-fonts', function() {
    return gulp.src('dist/third-party/font-awesome/fonts/*')
        .pipe(gulp.dest('app/third-party/font-awesome/fonts'))
        .pipe(notify({ message: 'Deploy third-party fonts task complete' }));
});

// deploy develop
gulp.task('deploy-debug', function(cb) {

    fileDiscriminator = '!(*.min.*)';
    runsequence(['deploy-js', 'deploy-css', 'deploy-third-party', 'deploy-third-party-fonts'], cb)
});

// deploy release
gulp.task('deploy-release', function(cb) {

    fileDiscriminator = '+(*.min.*)';
    runsequence(['deploy-js', 'deploy-css', 'deploy-third-party', 'deploy-third-party-fonts'], cb)
});

// Static Server + watching files
gulp.task('serve', function() {

    browserSync.init({
        server: "./app"
    });

    // Watch app files
    gulp.watch('src/*.html', ['inject']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['deploy-css']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['deploy-js']);

    // Watch third party files
    gulp.watch('node_modules/jquery/**/*', ['jquery']);
    gulp.watch('node_modules/bootstrap/**/*', ['bootstrap']);
    gulp.watch('node_modules/font-awesome/**/*', ['font-awesome']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    //Watch .mp4 files
    gulp.watch('src/video/**/*.mp4', ['video']);

    // Watch any files in src/, reload on change
    gulp.watch(['src/**']).on('change', browserSync.reload);
});

gulp.task('base', function(cb) {
    runsequence(
        'clean',
        ['styles', 'js'],
        ['jquery', 'bootstrap', 'font-awesome'],
        ['images', 'video'],
        cb);
});

gulp.task('inject', function() {

    var sources = gulp.src([
            './app/third-party/**/'.concat(fileDiscriminator),
            './app/css/**/simple'.concat(fileDiscriminator),
            './app/css/**/app'.concat(fileDiscriminator),
            './app/js/**/'.concat(fileDiscriminator)]
        , {read: false});

    return gulp.src('./src/index.html')
        .pipe(inject(sources, {ignorePath: 'app'}))
        .pipe(gulp.dest('./app'));
});

// Default task
gulp.task('default', function() {
    runsequence('base', 'deploy-release', 'inject', 'serve');
});

// Release task
gulp.task('debug', function() {
    runsequence('base', 'deploy-debug', 'inject', 'serve');
});
