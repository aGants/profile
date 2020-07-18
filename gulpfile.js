let {src, dest, parallel, series, watch} = require('gulp');

const ghpages      = require('gh-pages');
const path         = require('path');
const devserver    = require('browser-sync').create();
const del          = require('del');
const plumber      = require('gulp-plumber');
const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const typograf     = require('gulp-typograf');

function ghPages(cb) {
  ghpages.publish(path.join(process.cwd(), './build'), cb);
}

function devServer() {
  devserver.init({
    server: { baseDir: './build'},
    watch: true,
    reloadDebounce: 150,
    notify: false,
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
  return src('src/images/**/*')
    .pipe(newer('build/images'))
    .pipe(imagemin())
    .pipe(dest('build/images'));
}

function buildScripts() {
  return src('src/scripts/**/*.js')
    .pipe(dest('build/scripts/'));
}

function buildAssets() {
  return src('src/images/**/*.*')
    .pipe(dest('build/images/'));
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
  watch('src/images/**/*.*', buildAssets);
  watch('src/images/**/*.*', buildFonts);
}

exports.pages = ghPages;
exports.default =
  series(
    clearBuild,
    parallel(
      devServer,
      series(
        parallel(buildPages, buildStyles, buildScripts, buildAssets, buildFonts),
        watchFiles
      )
    )
  );

// exports.default = parallel(buildStyles, buildScripts, devServer, watchFiles)

