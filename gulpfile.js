let {src, dest, parallel, series, watch} = require('gulp');

const ghpages      = require('gh-pages');
const path         = require('path');
const browserSync = require('browser-sync').create();
const del          = require('del');
const plumber      = require('gulp-plumber');
const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const imagemin     = require('gulp-imagemin');
const typograf     = require('gulp-typograf');
const uglify       = require('gulp-uglify-es').default;

function ghPages(cb) {
  ghpages.publish(path.join(process.cwd(), './build'), cb);
}

function devServer() {
  browserSync.init({
    server: { baseDir: './build'},
    watch: true,
    reloadDebounce: 150,
    notify: false,
    online: true
  });
}

function buildPages() {
  return src('src/pages/*.pug')
    .pipe(pug(/*{pretty: true}*/))
    .pipe(typograf({locale: ['ru', 'en-US'] }))
    .pipe(dest('build/'));
}

function buildStyles() {
  return src('src/styles/style.scss')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(dest('build/styles/'));
}

function buildImages() {
  return src('src/images/**/*.*')
    .pipe(imagemin())
    .pipe(dest('build/images/'));
}

function buildScripts() {
  return src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(dest('build/scripts/'));
}

function buildFonts() {
  return src('src/fonts/**/*.*')
    .pipe(dest('build/fonts/'));
}

function clearBuild() {
  return del('build/**/*', {force: true});
}

function watchFiles() {
  watch('src/pages/*.pug', buildPages);
  watch('src/styles/*.scss', buildStyles);
  watch('src/scripts/**/*.js', buildScripts);
  watch('src/images/**/*.*', buildFonts);
  watch('src/images/**/*.*', buildImages);
}

exports.pages = ghPages;
exports.default =
  series(
    clearBuild,
    parallel(
      devServer,
      series(
        parallel(buildPages, buildStyles, buildScripts, buildImages, buildFonts),
        watchFiles
      )
    )
  );

