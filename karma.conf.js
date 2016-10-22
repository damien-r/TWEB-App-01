'use strict';

// Karma configuration
module.exports = function (config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-aria/angular-aria.js',
            'app/app.js',
            'app/modules/home/homeModule.js',
            'app/modules/home/homeCtrl.js',
            'app/modules/home/homeRoute.js',
            'app/modules/home/homeService.js',
            'app/modules/home/home-test.js',
            'app/modules/explorer/explorerModule.js',
            'app/modules/explorer/explorerCtrl.js',
            'app/modules/explorer/explorerRoute.js',
            'app/modules/explorer/explorerService.js',
            'app/modules/explorer/explorer-test.js',
            'app/modules/statistics/statisticsModule.js',
            'app/modules/statistics/statisticsCtrl.js',
            'app/modules/statistics/statisticsRoute.js',
            'app/modules/statistics/statisticsService.js',
            'app/modules/statistics/statistics-test.js',
		],

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['spec'],

		plugins : [
			'karma-jasmine',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-phantomjs-launcher',
			'karma-spec-reporter'
		],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
