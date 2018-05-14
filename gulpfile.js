const gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	uglifycss = require('gulp-uglifycss'),
	rename = require('gulp-rename'),
	sasslint = require('gulp-sass-lint'),
	imagemin = require('gulp-imagemin'),
	runSequence = require('run-sequence'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	Handlebars = require('handlebars'),
	handlebars = require('jstransformer')(require('jstransformer-handlebars'))
;

const Metalsmith = require('metalsmith'),
	markdown = require('metalsmith-markdown'),
	collections = require('metalsmith-collections'),
	layouts = require('metalsmith-layouts'),
	inPlace = require('metalsmith-in-place'),
	discoverHelpers = require('metalsmith-discover-helpers')
	dataLoader = require("metalsmith-data-loader"),
	models = require('metalsmith-models'),
	registerHelpers = require('metalsmith-register-helpers'),
	paths = require('metalsmith-paths'),
	rootPath = require('metalsmith-rootpath'),
	permalinks = require('metalsmith-permalinks'),
	drafts = require('metalsmith-drafts')
;

/**
 * VARIABLES
 **/
const app = {
	src: 'src/',
	dist: 'dist/'
};

const dir = {
	base:   __dirname + '/',
	lib:    __dirname + '/lib/',
	source: './src/',
	dest:   './build/'
};

const templateConfig = {
	engine:     'handlebars',
	directory:  dir.source + 'layouts/',
	default:    'default.hbs',
	partials:   dir.source + 'partials',
	partialExtension: ".hbs",
	pattern: '**/*.{handlebars,hbs,html,md}'
};

const metadata = {
	generatorname: "Metalsmith",
	generatorurl: "http://metalsmith.io/",
	site: {
		name: 'Yannick Herzog',
		author: 'Yannick Herzog',
		description: 'Yannick Herzog, Webentwickler für moderne Websites und Webapplikationen in HTML/CSS und JavaScript.',
		navigation: require(dir.source + 'models/nav__main.json'),
		notifications: require(dir.source + 'models/notifications.json')
	},
	production: false
};

/**
 * HTML
 */
gulp.task('html', () => {

	var metalsmith = Metalsmith(__dirname)
		.metadata(metadata)
		.source(dir.source + 'pages/')
		.destination(dir.dest)
		.clean(false)
		.use(dataLoader({
			dataProperty: "data",
			directory: dir.source + "models/"
		}))
		.use(markdown())
		.use(registerHelpers({
			directory: 'node_modules/handlebars-helpers/lib/'
		}))
		.use(registerHelpers({
			directory: dir.source + 'helpers'
		}))
		.use(drafts())
		.use(collections({
			projekte: {
				pattern: dir.source + 'pages/projekte/*.hbs',
				sortBy: 'date',
				reverse: true
			},
			blog: {
				pattern: dir.source + 'pages/blog/*.hbs',
				sortBy: 'date',
				reverse: true
			}
		}))
		.use(rootPath())
		.use(layouts(templateConfig))
		.use(paths({
			property: "paths"
		}))
		.use(inPlace())
		.build(function(err) {
			if (err) throw err;
		});

});

/**
 * CSS
 */
gulp.task('sass', () => {
	return gulp.src(dir.source + 'assets/scss/**/*.{scss,sass}')
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['node_modules/support-for/sass']
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(uglifycss({
			'maxLineLen': 80,
			'uglyComments': true
		}))
		.pipe(rename({
			suffix: '.min',
			extname: '.css'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(dir.dest + 'assets/css'));
});

gulp.task('build:css', () => {
	return gulp.src(dir.source + 'assets/scss/**/*.{scss,sass}')
		.pipe(sass({
			includePaths: ['node_modules/support-for/sass']
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(uglifycss({
			'maxLineLen': 80,
			'uglyComments': true
		}))
		.pipe(rename({
			suffix: '.min',
			extname: '.css'
		}))
		.pipe(gulp.dest(dir.dest + 'assets/css'))
	;
});

gulp.task('scss-lint', () => {
	return gulp.src(app.src + 'scss/**/*.scss')
		.pipe(sasslint())
		.pipe(sasslint.format())
		.pipe(sasslint.failOnError())
	;
});


/**
 * JAVASCRIPT
 */
gulp.task('compress:js', () => {
	gulp.src(dir.source + 'assets/js/main.js')
		.pipe(uglify({

		}))
		.pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
		.pipe(gulp.dest(dir.dest + 'assets/js'));

	gulp.src(['node_modules/intersection-observer/intersection-observer.js'])
		.pipe(uglify({}))
		.pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
		.pipe(gulp.dest(dir.dest + 'assets/js/'))
	;
});

gulp.task('compress:plugins', () => {
	gulp.src(dir.source + 'assets/js/plugins/*.js')
		.pipe(uglify({

		}))
		.pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
		.pipe(gulp.dest(dir.dest + 'assets/plugins'));
});

/**
 * Browsersync
 */
gulp.task('serve', () => {
	browserSync.init({
		reloadDelay: 1500,
		server: {
			baseDir: dir.dest
		},
		open:false
	});
});

/**
 * COPY
 */
gulp.task('copy:assets', () => {
	gulp.src([
		dir.source + 'assets/vendor/*.*',
	])
	.pipe(gulp.dest(dir.dest+'assets/vendor'));

	/**
	 * Fonts
	 */
	gulp.src([app.src + 'assets/fonts/**/*'])
	.pipe(gulp.dest(dir.dest+'assets/fonts'));

	/**
	 * Fontawesome
	 */
	gulp.src(['node_modules/font-awesome/fonts/*'])
	.pipe(gulp.dest(dir.dest+'assets/fonts'));

	/**
	 * jQuery
	 */
	gulp.src([
		'node_modules/jquery/dist/jquery.min.js'
	])
	.pipe(gulp.dest(dir.dest + 'assets/vendor/'));

});

gulp.task('copy:plugins', () => {

	gulp.src([dir.source + 'assets/js/prism.js'])
		.pipe(gulp.dest(dir.dest + 'assets/js/'));

	gulp.src(['node_modules/owl.carousel/dist/**/*.*'])
		.pipe(gulp.dest(dir.dest + 'assets/plugins/owl-carousel/'))
	;

	// gulp.src(['node_modules/jquery-inview/jquery.inview.min.js'])
	// 	.pipe(gulp.dest(app.templates + 'scripts/plugins/jquery-inview'))
	// ;


	// gulp.src(['node_modules/jquery.cookie/jquery.cookie.js'])
	// 	.pipe(gulp.dest(app.templates + 'scripts/plugins/jquery.cookie'))
	// ;


});

gulp.task('imagemin', () => {
	gulp.src(dir.source + 'assets/img/**/*.{jpg,gif,png}')
		.pipe(imagemin())
		.pipe(gulp.dest(dir.dest + 'assets/img'))
});

gulp.task('clean', () => {
	return gulp.src(dir.dest + '*')
		.pipe(clean());
});

/**
 * WATCHER
 **/
gulp.task('watch', () => {
	gulp.watch(dir.source + '**/*.{handlebars,hbs,md}', ['html']).on('change', reload);
	gulp.watch(dir.source + 'models/**/*.{json}', ['html']).on('change', reload);
	gulp.watch(dir.source + 'assets/scss/**/*.{scss,sass}', ['sass']).on('change', reload);
	gulp.watch(dir.source + 'assets/js/*.js', ['compress:js']).on('change', reload);
});

gulp.task('default', () => {
	runSequence(['watch'], 'serve');
});

gulp.task('build', ['clean'], () => {
	console.log('Start building website...');

	metadata.production = true;
	runSequence(['html', 'build:css', 'compress:js', 'copy:assets', 'copy:plugins', 'imagemin']);

	console.log('Finish building website...');
});
