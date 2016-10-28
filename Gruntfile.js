// Grunt tasks

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        '* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
        '* @author <%= pkg.author %>\n' +
        '*/\n',

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            app: {
                src: ['app/modules/**/*.js']
            }
        },

        exec: {
            bowerInstaller: 'bower-installer'
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            base: {
                src: [
                    // Angular Project Dependencies,
                    'app/app.js',
                    'app/app.config.js',
                    'app/modules/**/*Module.js',
                    'app/modules/**/*Route.js',
                    'app/modules/**/*Ctrl.js',
                    'app/modules/**/*Service.js',
                    'app/modules/**/*Directive.js'
                ],
                dest: 'app/assets/app/js/<%= pkg.name %>-app.js'
            },
            build: {
                src: [
                    // Angular Project Dependencies,
                    'app/assets/vendor/angular/angular.js',
                    'app/assets/vendor/chart.js/Chart.js', // Hack to include chart.js before angulare-chart.js
                    'app/assets/vendor/**/*.js',
                    '!app/assets/vendor/*.*' // Hack to exclude folder containing a dot (like Chart.js and angular-chart.js)

                ],
                dest: 'app/assets/app/js/<%= pkg.name %>-vendor.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                report: 'min'
            },
            base: {
                src: ['<%= concat.base.dest %>'],
                dest: 'app/assets/app/js/<%= pkg.name %>-angscript.min.js'
            },
            basePlugin: {
                src: [ 'src/plugins/**/*.js' ],
                dest: 'app/assets/app/js/plugins/',
                expand: true,
                flatten: true,
                ext: '.min.js'
            }
        },

        /*connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 4000,
                    base: '.',
                    hostname: 'localhost',
                    debug: true,
                    livereload: true,
                    open: true
                }
            }
        },

        concurrent: {
            tasks: ['connect', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },*/

        execute: {
            target: {
                src: ['server/server.js']
            }
        },

        env : {
            src : '.env'
        },

        watch: {
            app: {
                files: 'app/**/*',
                tasks: ['jshint:app'],
                options: {
                    livereload: true
                }
            }
        },

        injector: {
            options: {
                ignorePath: 'app/'
            },
            dev: {
                files: {
                    'app/index.html': [
                        'app/assets/vendor/angular/angular.js',
                        'app/assets/vendor/chart.js/Chart.js', // Hack to include chart.js before angulare-chart.js
                        'app/assets/vendor/**/*.js',
                        '!app/assets/vendor/*.*', // Hack to exclude folder containing a dot (like Chart.js and angular-chart.js)
                        'app/app.js',
                        'app/app.config.js',
                        'app/**/*Module.js',
                        'app/**/*Route.js',
                        'app/**/*Ctrl.js',
                        'app/**/*Service.js',
                        'app/**/*Directive.js'
                    ]
                }
            },
            production: {
                files: {
                    'app/index.html': [
                        'app/assets/app/css/*.css',
                        'app/assets/app/js/*vendor.js',
                        'app/assets/app/js/*app.js',
                        'app/assets/app/js/*.js'
                    ]

                }
            }
        },

        ngtemplates: {
            app: {
                src: 'app/modules/**/*.html',
                dest: 'app/assets/app/js/templates.js',
                options: {
                    module: '<%= pkg.name %>',
                    root: 'app/',
                    standAlone: false
                }
            }
        }

    });

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project if something fail.
    grunt.option('force', true);

    // Register grunt tasks
    grunt.registerTask('build', [
        'jshint',
        'exec',
        'concat',
        'ngtemplates',
        'injector:production'/*,
        'concurrent'*/
    ]);
    grunt.registerTask('serve-build', [
        'build',
        'env',
        'execute'
    ]);

    // Development tasks
    grunt.registerTask('dev', [
        'exec',
        'injector:dev'/*,
        'concurrent'*/
    ]);
    grunt.registerTask('serve-dev', [
        'dev',
        'env',
        'execute'
    ]);
};
