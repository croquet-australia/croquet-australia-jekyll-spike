/* global process */

var $ = require('gulp-load-plugins')({ lazy: true });
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var shell = require('gulp-shell');

var config = {
    siteWatch: ['artifacts/*.*'],
    sourceWatch: ['source/*.*', '!source/_site/*.*']
}

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Runs the Jekyll website
 * 
 * The 'run' task builds the Jekyll website and loads it in the
 * browser. The 'run-jekyll' task watches for changes to source files. When a 
 * change occurs then:
 * 
 *  - the site is regenerated.
 *  - 'site-watch' sees the regeneration refreshes the browser.
 */
gulp.task('run', ['run-watch', 'run-browserSync', 'run-jekyll']);

/**
 * Starts Browsersync.
 * 
 * Browsersync opens the website in your current browser then automotically
 * refreshes the browser when the site changes. 
 */
gulp.task('run-browserSync', function () {
    log('Starting Browsersync...');

    browserSync.init({
        proxy: 'http://localhost:4000'
    });
});

/**
 * Starts the jekyll server 
 */
gulp.task('run-jekyll', function () {
    log('Starting Jekyll server...');

    var command = 'jekyll serve --incremental --source ./source --destination ./artifacts';
    var options = {
        env: {
            path: '.\\tools\\ruby\\bin;.\\tools\\ruby-devkit\\bin;' + process.env.PATH
        }
    };

    return gulp
        .src('./source/index.html', { read: false })
        .pipe(shell(command, options));
});

/**
 * Watches the site for changes
 */
gulp.task('run-watch', function () {
    log('Starting watch...');
    gulp.watch(config.siteWatch).on("change", browserSync.reload);
})

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.yellow(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.yellow(msg));
    }
}
