// Utilities
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var fs = require('fs');

// Gulp
var gulp = require('gulp');

// Gulp plugins
var header = require('gulp-header');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var notify = require("gulp-notify");


// Misc/global vars
var pkg = JSON.parse(fs.readFileSync('package.json'));

// Task options
var opts = {
  destPath: './',
  buildPath: './dist/',
  concatName: 'mime-icons.css',

  autoprefixer: {
    dev: {
      browsers: ['last 1 versions'],
      cascade: false
    },
    build: {
      browsers: ['> 1%', 'last 2 versions'],
      cascade: false
    }
  },
  
  minRename: {
    suffix: '.min'
  },
  
  sass: {
    outputStyle: 'nested',
    errLogToConsole: true
  },
  
  cssnano: {reduceIdents: {keyframes: false}},

  banner: [
    '/*!',
    ' * <%= name %> -<%= homepage %>',
    ' * Version - <%= version %>',
    ' * Licensed under the MIT license - http://opensource.org/licenses/MIT',
    ' *',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= author.name %>',
    ' */\n\n'
  ].join('\n')
};

// ----------------------------
// Gulp task definitions
// ----------------------------

gulp.task('build', function () {

  return gulp.src('./progress.scss')
    
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(gulp.dest(opts.buildPath))
    .pipe(postcss([
      autoprefixer(opts.autoprefixer.build),
      cssnano(opts.cssnano)
    ]))
    .pipe(header(opts.banner, pkg))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest(opts.buildPath));
});
  
gulp.task('sass', function () {
  
  return style = gulp.src('./progress.scss')
  
    .pipe(sourcemaps.init())
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(postcss([
      autoprefixer(opts.autoprefixer.dev)
    ]))    
    .pipe(sourcemaps.write(opts.destPath))
    .pipe(gulp.dest(opts.destPath));

});

gulp.task('watch', function () {
  watch('./**/*.scss', function () {
    gulp.start('sass');
  });
});

gulp.task('default', ['finalize']);

gulp.task('finalize', function(callback) {
  return runSequence('build');
});