// Include gulp
var gulp = require("gulp");

// Include Our Plugins
//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
var browserSync = require("browser-sync").create();

//var minifyHtml = require("gulp-minify-html");
//var minifyCss = require("gulp-minify-css");
//var imagemin = require('gulp-imagemin');

gulp.task("imagemin", function() {
    gulp.src("img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});
// task
gulp.task("minify-css", function() {
    gulp.src("css/styles.css") // path to your file
        .pipe(minifyCss())
        .pipe(gulp.dest("dist/css"));
});

// task
gulp.task("minify-html", function() {
    gulp.src("*.html") // path to your files
        .pipe(minifyHtml())
        .pipe(gulp.dest("dist"));
});

// Static server
gulp.task("browser-sync", function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false,
        files: ["*.css", "*.html", "css/*.css"]
    });
});

// Lint Task
gulp.task("lint", function() {
    return gulp
        .src("js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

// Compile Our Sass
gulp.task("sass", function() {
    return gulp
        .src("scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"));
});

// Concatenate & Minify JS
gulp.task("scripts", function() {
    return gulp
        .src("js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("compcss", function() {
    return gulp
        .src("js/*.js")
        .pipe(concat("all.js"))
        .pipe(gulp.dest("dist"))
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

// Watch Files For Changes
gulp.task("watch", function() {
    gulp.watch("js/*.js", ["lint", "scripts"]);
    gulp.watch("scss/*.scss", ["sass"]);
});

// Default Task
gulp.task("default", ["lint", "sass", "scripts", "watch"]);
