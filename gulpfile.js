var gulp = require('gulp');
var server = require('gulp-webserver');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-clean-css');
var jsmin = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sequence = require('gulp-sequence');
var clean = require('gulp-clean');
var json = require('./src/data/data.json');
// console.log(list);
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
};
gulp.task('watch', function() {
    gulp.watch('src/css/style.css', ['cssmin'])
    gulp.watch('src/*.html', ['htmlmin'])
    gulp.watch('src/imgs/*.{png,jpg}', ['copyimg'])
})
gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
})
gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
})
gulp.task('copyimg', function() {
    return gulp.src('src/imgs/*')
        .pipe(gulp.dest('dist/imgs'));
})
gulp.task('copy', function() {
    return gulp.src('src/fonts2/*')
        .pipe(gulp.dest('dist/fonts2'))
})
gulp.task('copyjs', function() {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
})
gulp.task('cssmin', function() {
    return gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android>=4.0']
        }))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('server', function() {
    gulp.src('dist')
        .pipe(server({
            port: 3335,
            open: true,
            livereload: true,
            host: '169.254.5.166',
            middleware: function(req, res, next) {
                if (/\/list/g.test(req.url)) {
                    // res.setHeader(200, { 'Content-Type': 'text/plain;charset=utf-8;' })
                    res.end(JSON.stringify(json));
                }
                next();
            }
        }))
})
gulp.task('default', function(cb) {
    sequence('clean', ['cssmin', 'htmlmin', 'copy', 'copyjs', 'copyimg', 'watch'], 'server', cb);
})