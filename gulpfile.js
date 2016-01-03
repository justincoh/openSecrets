var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint',function(){
	return gulp.src('d3/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('scripts',function(){
	return gulp.src('d3/*.js')
		.pipe(concat('concattedD3.js'))
		.pipe(gulp.dest('d3'))
		.pipe(rename('allD3.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('d3'));
});

