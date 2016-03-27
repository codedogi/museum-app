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
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    debug = require('gulp-debug');

var fileDiscriminator = '';

// Html
gulp.task('html', function() {
    return gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));
    //.pipe(notify({ message: 'HTML task complete' }));
});

// Styles
gulp.task('styles', function() {
    return sass('src/styles/**/*.scss', { style: 'expanded' })
        .pipe(gulp.dest('dist/styles'))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles'));
        //.pipe(notify({ message: 'Styles task complete' }));
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
        .pipe(gulp.dest('dist/js'));
    //.pipe(notify({ message: 'JS task complete' }));
});

gulp.task('controllers', function() {
    return gulp.src('src/controllers/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        .pipe(gulp.dest('dist/controllers'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/controllers'));
    //.pipe(notify({ message: 'Controllers task complete' }));
});

gulp.task('routes', function() {
    return gulp.src('src/routes/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        .pipe(gulp.dest('dist/routes'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/routes'));
    //.pipe(notify({ message: 'Controllers task complete' }));
});

// Video
gulp.task('video', function() {
    return gulp.src('src/video/**/*')
        .pipe(gulp.dest('app/video'));
        //.pipe(notify({ message: 'Video task complete' }));
});

// Server
gulp.task('server', function() {
    return gulp.src('src/server/server.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/server'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/server'));
        //.pipe(notify({ message: 'Server task complete' }));
});

gulp.task('jquery', function() {
    return gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('dist/third-party/jquery'));
        //.pipe(notify({ message: 'JQuery task complete' }));
});

gulp.task('bootstrap', function() {
    return gulp.src('node_modules/bootstrap/dist/!(fonts)/!(npm.js)')
        .pipe(gulp.dest('dist/third-party/bootstrap'));
        //.pipe(notify({ message: 'Bootstrap task complete' }));
});

gulp.task('font-awesome', function() {
    return gulp.src('node_modules/font-awesome/+(css|fonts)/*')
        .pipe(gulp.dest('dist/third-party/font-awesome'));
        //.pipe(notify({ message: 'Font Awesome task complete' }));
});

gulp.task('swig', function() {
    return gulp.src('node_modules/swig/dist/**/*')
        .pipe(gulp.dest('dist/third-party/swig'));
    //.pipe(notify({ message: 'Swig task complete' }));
});

// bust cache
gulp.task('bust', function (done) {
    return cache.clearAll(done);
});

// deploy server code
gulp.task('deploy-start', ['server'], function() {
    var stream = gulp.src('src/index.js')
        .pipe(gulp.dest('app'));
    //.pipe(notify({ message: 'Deploy start script complete' }));

    return stream;
});

// deploy server code
gulp.task('deploy-server', ['server'], function() {
    var stream = gulp.src('dist/server/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/server'));
    //.pipe(notify({ message: 'Deploy server complete' }));

    return stream;
});

gulp.task('deploy-views', function() {
    return gulp.src('dist/views/**/!(index.*)')
        .pipe(gulp.dest('app/views'));
    //.pipe(notify({ message: 'Deploy views complete' }));
})

gulp.task('deploy-controllers', function() {
    return gulp.src('dist/controllers/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/controllers'));
    //.pipe(notify({ message: 'Deploy controllers complete' }));
});

gulp.task('deploy-routes', function() {
    return gulp.src('dist/routes/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/routes'));
    //.pipe(notify({ message: 'Deploy routes complete' }));
});

gulp.task('deploy-js', function() {
    return gulp.src('dist/js/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/js'));
        //.pipe(notify({ message: 'Deploy js complete' }));
});

gulp.task('deploy-css', function() {
    return gulp.src('dist/styles/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/css'));
        //.pipe(notify({ message: 'Deploy css task complete' }));
});

gulp.task('deploy-third-party', function() {
    return gulp.src('dist/third-party/**/' + fileDiscriminator)
        .pipe(gulp.dest('app/third-party'));
        //.pipe(notify({ message: 'Deploy third-party task complete' }));
});

gulp.task('deploy-third-party-fonts', function() {
    return gulp.src('dist/third-party/font-awesome/fonts/*')
        .pipe(gulp.dest('app/third-party/font-awesome/fonts'));
        //.pipe(notify({ message: 'Deploy third-party fonts task complete' }));
});

// deploy
gulp.task('deploy', [
    'deploy-controllers',
    'deploy-routes',
    'deploy-js',
    'deploy-css',
    'deploy-third-party',
    'deploy-third-party-fonts',
    'deploy-views']);


// Static Server + watching files
gulp.task('serve', function() {

    browserSync.init({
        server: "./app"
    });

    // Watch app files
    gulp.watch('src/views/index.html', ['inject']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['deploy-css']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['deploy-js']);
    gulp.watch('src/controllers/**/*.js', ['deploy-controllers']);
    gulp.watch('src/routes/**/*.js', ['deploy-routes']);

    // Watch third party files
    gulp.watch('node_modules/jquery/**/*', ['jquery']);
    gulp.watch('node_modules/bootstrap/**/*', ['bootstrap']);
    gulp.watch('node_modules/font-awesome/**/*', ['font-awesome']);
    gulp.watch('node_modules/swig/**/*', ['swig']);

    //Watch .mp4 files
    gulp.watch('src/video/**/*.mp4', ['video']);

    // Watch any files in src/, reload on change
    gulp.watch(['src/**']).on('change', browserSync.reload);
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/*', 'app/*'])
        .pipe(clean());
});

// Common tasks
gulp.task('common', ['styles', 'js', 'controllers', 'routes', 'video', 'jquery', 'bootstrap', 'font-awesome', 'swig', 'html']);

// Inject styles and javascript into index.html
gulp.task('inject', function() {

    var sources = gulp.src([
            './app/third-party/**/'.concat(fileDiscriminator)
            , './app/css/**/simple'.concat(fileDiscriminator)
            , './app/css/**/app'.concat(fileDiscriminator)
            , './app/js/**/'.concat(fileDiscriminator)
            , './app/controllers/**/'.concat(fileDiscriminator)
            , './app/routes/**/'.concat(fileDiscriminator)
        ], {read: false});

    return gulp.src('./dist/views/index.html')
        .pipe(inject(sources, {ignorePath: 'app'}))
        .pipe(gulp.dest('./app/views'));
});

// Default task
gulp.task('default', ['clean'], function(cb) {
    fileDiscriminator = '+(*.min.*)';
    runSequence('common', 'deploy', 'inject', 'deploy-server', 'deploy-start'); //, 'serve');
});

// Debug task
gulp.task('debug', ['clean'], function() {
    fileDiscriminator = '!(*.min.*)';
    runSequence('common', 'deploy', 'inject', 'deploy-server', 'deploy-start'); //, 'serve');
});
