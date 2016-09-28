(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:explorerService
	 * @description
	 * # explorerService
	 * Service of the app
	 */

  	angular
		.module('explorer')
		.factory('ExplorerService', Explorer);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Explorer.$inject = ['$http'];

		function Explorer ($http) {

		}

})();
