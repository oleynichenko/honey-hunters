var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");

var path = ``;

gulp.task("style", function() {
  gulp.src(`${path}sass/style.scss`)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions" 
      ]})
    ]))
    .pipe(gulp.dest(`${path}css`))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(`${path}css`))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`${path}sass/**/*.scss`, ["style"]);
  gulp.watch(`${path}*.html`).on("change", server.reload);
  gulp.watch(`${path}js/*.js`).on("change", server.reload);
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
 return gulp.src([
   "img/**",
   "js/**",
   "css/*.min.css",
   "css/*.min.css.map",
   "*.html",
   ], {
   base: "."
   })
 .pipe(gulp.dest("build"));
});

gulp.task("build", function(fn) {
  run("clean", "copy", fn);
});
