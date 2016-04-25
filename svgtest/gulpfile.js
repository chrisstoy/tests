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
var globby = require('globby');
var through = require('through2');

var CacheBuster  = new require('gulp-cachebust');
var cachebust = new CacheBuster ();

/* Define the paths needed for building */
var Paths = {

	source : './app',
	distDev : './dist',
	distProd : './prod'

};

/***** Build Tasks ********/

/* Remove all generated files */
gulp.task('clean', function() {

	return del([
		'./dist'
	]);

});

/* Build the CSS files from the SASS files */
gulp.task('build-css', ['clean'], function() {

	return gulp.src(Paths.source+'/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(cachebust.resources())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(Paths.distDev));

});

/* Process the HTML files */
gulp.task('build-html', ['build-css'], function () {

	return gulp.src([
			Paths.source+'*.html',
			Paths.source+'/components/**/*.html',
			Paths.source+'/services/**/*.html'
		])
		.pipe(cachebust.references())
		.pipe(gulp.dest(Paths.distDev));
});

/* Build all the js files */
gulp.task('build-js', ['clean'], function() {

	var b = browserify({
		entries: Paths.source+'/app.js',
		debug: true,
		paths: [Paths.source+'/components', Paths.source+'/services'],
		transform: [ngAnnotate]
	});

	return b.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(Paths.distDev));

});

/* Build and bundle all the files */
gulp.task('build-js-bundled', ['clean'], function() {

	var bundledStream = through();

	bundledStream
		.pipe(source(Paths.source+'/app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(Paths.distDev));

	globby(['./entries/*.js']).then(function(entries){
		var b = browserify({
			entries: Paths.source+'/app.js',
			debug: true,
			paths: [Paths.source+'/components', Paths.source+'/services'],
			transform: [ngAnnotate]
		});

		b.bundle().pipe(bundledStream);

	}).catch(function(err){
		// handle errors
		bundledStream.emit('error', err);
	});

	return bundledStream;
});

gulp.task('watch', function() {
	gulp.watch( Paths.source+'/**/*.js', ['build-js'])
	gulp.watch( Paths.source+'/**/*.scss', ['build-css'])
	gulp.watch( Paths.source+'/**/*.html', ['build-html'])
});


gulp.task('default', ['build-js', 'build-html', 'build-css']);