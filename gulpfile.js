let gulp = require("gulp")
const connect = require("gulp-connect-php")
const browserSync = require("browser-sync")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const postcssScss = require("postcss-scss")
const stylelint = require("stylelint")
const reporter = require("postcss-reporter")
const autoPrefixer = require("autoprefixer")
const cssDeclarationSorter = require("css-declaration-sorter")
const mqpacker = require("css-mqpacker")

const plugins = [
  autoPrefixer({
    browsers: ["last 2 versions"],
  }),
  cssDeclarationSorter({
    order: "smacss",
  }),
  mqpacker(),
]

gulp.task("serve", () => {
  connect.server({}, () => {
    browserSync({
      proxy: "127.0.0.1:8000",
    })
  })
})

gulp.task("reload", () => {
  browserSync.reload()
})

gulp.task("sass", () => {
  gulp
    .src("./page/demo/assets/scss/**/*.scss")
    .pipe(
      postcss([stylelint(), reporter({ clearReportedMessages: true })], {
        syntax: postcssScss,
      })
    )
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(postcss(plugins))
    .pipe(gulp.dest("./page/demo/assets/css/"))
})

gulp.task("default", ["serve", "sass"], () => {
  gulp.watch("**/*.php", ["reload"])
  gulp.watch("./page/demo/assets/scss/*.scss", ["sass"])
})
