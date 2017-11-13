'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const zip = require('gulp-zip');
const mocha = require('gulp-mocha');
const del = require('del');
const pkg = require('./package.json');
const tmpDir = 'tmp';
const runSequence = require('run-sequence');

gulp.task('clean', () => {
  return del('${pkg.name}.zip');
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'));
});

gulp.task('test', () => {
  return gulp.src('src/test/*.js')
              .pipe(mocha({reporter: 'nyan'}));
              
});

gulp.task('copySrcToTmp', () => {
  return gulp.src('src/**', {base: 'src'})
  .pipe(gulp.dest(tmpDir));
});

gulp.task('copyNodeModulesToTmp', () => {
  return gulp.src('node_modules/**', {base: '.'})
  .pipe(gulp.dest(tmpDir));
});

gulp.task('zipTmp', () => {
  return gulp.src(`${tmpDir}/**`, {base: tmpDir})
  .pipe(zip(`${pkg.name}.zip`))
  .pipe(gulp.dest('.'));
});

gulp.task('removeTmp', () => {
  return del([tmpDir,'node_modules']);
});

gulp.task('zip', () => {
  runSequence('copySrcToTmp', 'copyNodeModulesToTmp', 'zipTmp', 'removeTmp');
});

gulp.task('default', runSequence(['clean', 'lint'], 'test', 'zip'));
