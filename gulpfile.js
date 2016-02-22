/* jshint camelcase: false */
'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserSync = require('browser-sync'),
    proxy = require('proxy-middleware'),
    flatten = require('gulp-flatten'),
    sequence = require('gulp-sequence'),
    del = require('del'),
    url = require('url'),
    fs = require('fs');


/*

gulp.task('serve', function() {
    runSequence('wiredep:app', 'ngconstant:dev', 'sass', 'watch', function () {
        var baseUri = 'http://localhost:' + config.apiPort;
        var proxyRoutes = [
            '/api',
            '/health',
            '/configprops',
            '/v2/api-docs',
            '/swagger-ui',
            '/configuration/security',
            '/configuration/ui',
            '/swagger-resources',
            '/metrics',
            '/websocket/tracker',
            '/dump',
            '/console/'
        ];

        var requireTrailingSlash = proxyRoutes.filter(function (r) {
            var endsWith = function (r, suffix) {
                return str.indexOf('/', str.length - suffix.length) !== -1;
            };

            return endsWith(r, '/');
        }).map(function (r) {
            return r.substr(0, r.length - 1);
        });

        var proxies = [
            function (req, res, next) {
                requireTrailingSlash.forEach(function(route){
                    if (url.parse(req.url).path === route) {
                        res.statusCode = 301;
                        res.setHeader('Location', route + '/');
                        res.end();
                    }
                });

                next();
            }
        ].concat(
            proxyRoutes.map(function (r) {
                var options = url.parse(baseUri + r);
                options.route = r;
                return proxy(options);
            }));

        browserSync({
            open: false,
            port: config.port,
            server: {
                baseDir: config.app,
                middleware: proxies
            }
        });

    });
});

gulp.task('usemin', ['images', 'styles'], function() {
    return gulp.src([yeoman.app + '**!/!*.html', '!' + yeoman.app + '@(dist|bower_components)/!**!/!*.html'])
        .pipe(usemin({
            css: [
            ],
            html: [
                //htmlmin({collapseWhitespace: true})
            ],
            js: [
                ngAnnotate(),
                //uglify(), too slow
                'concat'
            ]
        }))
        .pipe(gulp.dest(yeoman.dist));
});

gulp.task('ngconstant:prod', function() {
    return ngConstant({
        dest: 'app.constants.js',
        name: 'aklApp',
        deps:   false,
        noFile: true,
        interpolate: /\{%=(.+?)%\}/g,
        wrap: '/!* jshint quotmark: false *!/\n"use strict";\n// DO NOT EDIT THIS FILE, EDIT THE GULP TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n{%= __ngModule %}',
        constants: {
            ENV: 'prod',
            VERSION: parseVersionFromPomXml()
        }
    })
        .pipe(gulp.dest(yeoman.tmp + 'scripts/app/'));
});

gulp.task('jshint', function() {
    return gulp.src(['gulpfile.js', yeoman.app + 'scripts/!**!/!*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

*/


// ---------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function() {

});

var config = {
    app: 'src/main/webapp/',
    dist: 'src/main/webapp/dist/',
    scss: 'src/main/scss/',
    ckeditor: 'src/main/ckeditor/',
    port: 9000,
    apiPort: 8080
};

var bopts = {
    entries: [config.app + 'main.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify] // Watch
};

var b = browserify(bopts);

function bundle() {
    b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(source('bundle.js'))
        .pipe(ngAnnotate())
        //.pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest(config.dist + 'js'))
        .pipe(browserSync.reload({stream: true, once: true}));
}

gulp.task('clean', function () {
    return del(config.dist);
});

gulp.task('views', function() {
    return gulp.src([config.app + '**/*.html', '!' + config.dist + '**/*.html'])
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', ['fonts', 'images', 'sass', 'ckeditor', 'i18n', 'swagger']);

gulp.task('fonts', function () {
    return gulp.src(['node_modules/bootstrap-sass/assets/fonts/**/*',
        'node_modules/font-awesome/fonts/**/*'])
        .pipe(gulp.dest(config.dist + 'fonts'));
});

gulp.task('images', function () {
    return gulp.src([config.app + 'assets/images/**/*'])
        .pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('sass', function () {
    return gulp.src(config.scss + 'main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.dist + 'css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('ckeditor', function () {
    return gulp.src(['node_modules/ckeditor/**/*',
            config.ckeditor + '**/*'])
        .pipe(gulp.dest(config.dist + 'ckeditor'));
});

gulp.task('i18n', function () {
    return gulp.src([config.app + 'i18n/**/*',
            'node_modules/angular-i18n/angular-locale_fi.js',
            'node_modules/angular-i18n/angular-locale_en.js'])
        .pipe(gulp.dest(config.dist + 'i18n'));
});

gulp.task('swagger', function () {
    return gulp.src('node_modules/swagger-ui/dist/**/*')
        .pipe(gulp.dest(config.dist + 'swagger-ui'));
});

gulp.task('browserify', function () {
    return bundle();
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: config.dist,
            middleware: [proxy({
                host: 'localhost',
                port: '8080',
                pathname: '/api',
                route: '/api'
            })]
        },
        port: config.port,
        open: false
    });
});

gulp.task('watch', function() {
    gulp.watch(config.scss + '**/*.scss', ['sass']);
    gulp.watch([config.app + '**/*.html', '!' + config.dist + '**/*.html'], ['views']);
});

gulp.task('build', sequence('clean', ['views', 'assets', 'browserify']));
gulp.task('dist', ['build']);
gulp.task('serve', sequence('build', ['browser-sync', 'watch']));
gulp.task('default', ['build']);

b.on('update', bundle);
b.on('log', gutil.log);
