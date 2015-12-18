module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {
			assets: 'src/assets',
			dist_assets: 'dist/assets',
			src: 'src',
			dist: 'dist'
		},

		/*
		 * Watch
		 */
		watch: {
			options: {
				livereload: true
			},
			sass: {
				files: ['<%=config.assets%>/scss/**/*.scss'],
				tasks: ['sass:dist', 'autoprefixer:dist']
			},
			assemble: {
				files: ['<%=config.src%>/{content,data,templates}/{,*/,**/}*.{hbs,md,yml,json}'],
				tasks: ['assemble']
			},
			images: {
				files: ['<%=config.assets%>/img/**/*.{jpg,png,gif}'],
				tasks: ['copy:images']
			},
			js: {
				files: ['<%=config.assets%>/js/**/*.js'],
				tasks: ['copy:js']
			}
		},

		/*
		 * Connect
		 */
		connect: {
			options: {
				port: 8000,
				hostname: '*',
				livereload: true
			},
			server: {
				options: {
					base: 'dist',
					open: false
				}
			}
		},

		/*
		 * Assemble.io
		 */
		assemble: {
			options: {
				flatten: true,
				expand: true,
				assets: '<%=config.dist_assets%>',
				data: 'src/data/**/*.{json,yml}',
				layout: 	false,
				layoutdir: 	'src/templates/layouts',
				partials: 	['src/templates/partials/**/*.hbs'],
				helpers: ['node_modules/handlebars-helpers/lib/helpers/*.js'],
				production: true,
				plugins: ['assemble-collection-context'],
				context: {
					dest: '<%=config.src%>/.tmp/'
				},
				pkg: '<%= pkg %>'
			},
			home: {
				options: {
					theme: '',
					data: '<%=config.src%>/.tmp/*.json'
				},
				files: [
					{
						expand: true,
						cwd: 'src/templates/pages',
						src: '*.hbs',
						dest: 'dist/',
						ext: '.html'
					}
				]
			},
			blog: {
				options: {
					theme: 'blog',
					collections: [
						{
							name: 'posts',
							inflection: 'post',
							sortorder: 'desc',
							sortby: 'date'
						}
					]
				},
				files: [
					{
						expand: true,
						cwd: 'src/templates/pages/blog',
						src: '**/*.hbs',
						dest: 'dist/blog',
						ext: '.html'
					}
				]
			},
			projekte: {
				options: {
					theme: 'projekte',
					slider: true
				},
				plugins: [],
				files: [
					{
						expand: true,
						cwd: 'src/templates/pages/projekte',
						src: '**/*.hbs',
						dest: 'dist/projekte',
						ext: '.html',
					}
				]
			},
			ueber: {
				options: {
					theme: 'ueber'
				},
				plugins: [],
				files: [
					{
						expand: true,
						cwd: 'src/templates/pages/ueber',
						src: '**/*.hbs',
						dest: 'dist/ueber',
						ext: '.html',
					}
				]
			}
		},

		/*
		 * Sass
		 */
		sass: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'<%=config.dist_assets%>/css/main.css':'<%=config.assets%>/scss/main.scss'
				}
			},
			normalize: {
				files: {
					'<%=config.dist_assets%>/css/normalize.css':'<%=config.assets%>/scss/normalize.scss'
				}
			},
			owl: {
				files: {
					'<%=config.dist_assets%>/css/owl.theme.yh.css':'<%=config.assets%>/scss/owl.theme.yh.scss'
				}
			}
		},

		/*
		 * autoprefixer
		 */
		autoprefixer: {
			options: {

			},
			dist: {
				src: '<%=config.dist_assets%>/css/main.css'
			}
		},

		/*
		 * Clean
		 */
		clean: {
			dist: {
				src: ['<%=config.dist%>']
			}
		},

		/*
		 * Copy
		 */
		copy: {
			images: {
				files: [
					{
						expand: true,
						flatte: true,
						cwd: '<%=config.assets%>/img/',
						src: '**',
						dest: '<%=config.dist_assets%>/img/'
					}
				]
			},
			js: {
				files: [
					{
						expand: true,
						flatte: true,
						cwd: '<%=config.assets%>/js/',
						src: '**',
						dest: '<%=config.dist_assets%>/js/'
					}
				]
			},
			fonts: {
				files: [
					{
						expand: true,
						flatten: true,
						cwd: 'node_modules/font-awesome/fonts/',
						src: '**',
						dest: '<%=config.dist_assets%>/fonts/'
					}
				]
			},
			vendor: {
				files: [
					{
						expand: true,
						flatten: true,
						cwd: '<%=config.assets%>/vendor/',
						src: '**',
						dest: '<%=config.dist_assets%>/vendor/'
					},
					{
						expand: true,
						flatten: true,
						cwd: 'node_modules/jquery/dist/',
						src: 'jquery.min.js',
						dest: '<%=config.dist_assets%>/vendor/'
					}
				]
			},
			owlCarousel: {
				files: [
					{
						expand: true,
						flatten: false,
						cwd: 'node_modules/owl.carousel/dist/',
						src: '**/*',
						dest: '<%=config.dist_assets%>/plugins/owl-carousel/'
					}
				]
			},
			htaccess: {
				files: [
					{
						expand: true,
						flatten: false,
						dot: true,
						cwd: '<%=config.src%>',
						src: ['.htaccess', 'robots.txt'],
						dest: '<%=config.dist%>/'
					}
				]
			}
		},

		/*
		 * CSSmin
		 */
		cssmin: {
			options: {

			},
			dist: {
				files: {
					'<%=config.dist_assets%>/css/main.min.css': ['<%=config.dist_assets%>/css/normalize.css', '<%=config.dist_assets%>/css/main.css']
				}
			}
		}

	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-newer');

	// Default task(s)
	grunt.registerTask('server', [
		'build',
		'connect:server',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'sass',
		'autoprefixer',
		'cssmin',
		'copy',
		'assemble'
	]);
};
