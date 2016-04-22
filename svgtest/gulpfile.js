/* Build file
	see: http://blog.jhades.org/what-every-angular-project-likely-needs-and-a-gulp-build-to-provide-it/
 */

'use strict';

var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var browserify = require('browserify');
var ngAnnotate = require('browserify-ngannotate');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

/* Remove all generated files */
gulp.task('clean', function() {

	return del([
		'./dist'
	]);

});

/* Build the CSS files from the SASS files */
gulp.task('build-css', ['clean'], function() {

	return gulp.src('./app/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./dist'));

});

/* Build all the js files */
gulp.task('build-js', ['clean'], function() {

	var b = browserify({
		entries: './app/app.js',
		debug: true,
		paths: ['./app/controllers', './app/services'],
		transform: [ngAnnotate]
	});

	return b.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.on('error', gutil.log)
		.pipe(gulp.dest('./dist/js/'));

});

gulp.task('default', ['build-css']);