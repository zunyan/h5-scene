var gulp = require('gulp'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	fs = require("fs"),
	uglifyjs = require("gulp-uglify"),
	concat = require("gulp-concat"),
	header = require('gulp-header'),
	footer = require('gulp-footer');

gulp.task('default', function() {

	var cssPath = "assets/stylesheet/css";
	var  list = [
		"src/less/base.less",
		"src/less/editor.less"
	];

	gulp.src(list)
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest(cssPath));


	var jsPath = "assets/javascript/module";
	gulp.src([
		"src/js/h5editor.js",
		"src/js/directive/componentImg.js",
		"src/js/directive/componentTxt.js",
		"src/js/directive/legendComponent.js",
		"src/js/directive/statge.js",
	]).pipe(concat('h5editor.js'))
		.pipe(header("(function(angular, window){"))
		.pipe(footer("})(angular, window);"))
		// .pipe(uglifyjs())
		.pipe(gulp.dest(jsPath))
});

