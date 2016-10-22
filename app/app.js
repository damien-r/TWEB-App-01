(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	angular.module('github-explorer', [
        'ngResource',
        'ngAria',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'home',
        'explorer',
        'statistics'
	]);

})();
