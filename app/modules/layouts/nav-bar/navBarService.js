(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

  	angular
		.module('github-explorer')
		.factory('MenuService', Menu);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Menu.$inject = ['$http'];

		function Menu ($http) {

			var menu = [
				
					{
						link: 'explorer',
							name: 'Explorer'
					},
			    
					{
						link: 'statistics',
							name: 'Statistics'
					},
			    
					{
						link: 'home',
							name: 'Home'
					},
			    
					{
						link: 'testmodule',
							name: 'Testmodule'
					},
			    
		  	];

			return {
				listMenu: function () {
					return menu;
				}
		  	}

		}

})();
