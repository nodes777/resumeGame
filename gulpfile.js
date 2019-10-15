//https://stackoverflow.com/questions/53573492/gulp-combining-tasks-into-default-command
var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var imagemin = require("gulp-imagemin");

// this task works, even though you have no sass
gulp.task("sass", function() {
    return gulp
        .src("sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./css/")) //removed semicolon
        .pipe(browserSync.reload({ stream: true }));
});

// Concatenate & Minify JS
gulp.task("scripts", function() {
    return gulp
        .src("js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("imagemin", function() {
    return gulp
        .src("img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});

gulp.task("minify-css", function() {
    return gulp
        .src("css/styles.css") // path to your file
        .pipe(minifyCss())
        .pipe(gulp.dest("dist/css"));
});

gulp.task("minify-html", function() {
    gulp.src("*.html") // path to your files
        .pipe(minifyHtml())
        .pipe(gulp.dest("dist"));
});

gulp.task("lint", function() {
    return gulp
        .src("js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
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
gulp.task("default", gulp.series(["lint", "sass", "scripts", "watch"]));

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task(
    "serve",
    gulp.series("scripts", function() {
        browserSync({
            server: {
                baseDir: "./"
            }
        });

        gulp.watch("js/*.js", browserSync.reload);
        gulp.watch("index.html", browserSync.reload);
    })
);
