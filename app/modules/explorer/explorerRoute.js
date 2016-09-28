'use strict';

/**
 * @ngdoc function
 * @name app.route:explorerRoute
 * @description
 * # explorerRoute
 * Route of the app
 */

angular.module('explorer')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('explorer', {
				url:'/explorer',
				templateUrl: 'app/modules/explorer/explorer.html',
				controller: 'ExplorerCtrl',
				controllerAs: 'vm'
			});


	}]);
