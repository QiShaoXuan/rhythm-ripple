const gulp = require('gulp')
const browserify = require("browserify")
const source = require('vinyl-source-stream')
const babelify = require("babelify")
const browserSync = require("browser-sync").create()

// rhythm 节奏动画
// ripple 正常动画
const buildWhat = process.argv[4]

gulp.task('scripts', function () {
  return browserify({
    entries: buildWhat === 'rhythm' ? './src/rhythmRipple.js' : './src/ripple.js',
    insertGlobals: true,
    standalone: 'umd'
  })
    .transform(babelify, {
      presets: ["es2015"]
    })
    .bundle()
    .pipe(source(buildWhat === 'rhythm' ? 'rhythmRipple.js' : 'ripple.js'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('default', ['scripts'], function () {
  browserSync.init({
    port: (new Date).getFullYear(),
    open: false,
    server: {
      baseDir: ['./']
    }
  })
  gulp.watch('src/*.js', ['scripts'])

  console.log('click to open page', `http://localhost:${(new Date).getFullYear()}/${buildWhat === 'rhythm' ? 'rhythm.html' : 'index.html'}`)
})
