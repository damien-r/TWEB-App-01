/*!
* github-explorer - v0.0.1 - MIT LICENSE 2016-09-28. 
* @author Les cours&#39;get
*/
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
		 'ui.bootstrap',
		 'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ui.router',
		'home',
		'statistics',
		'explorer',
	]);

})();

(function () {
	'use strict';

	/**
	 * @ngdoc configuration file
	 * @name app.config:config
	 * @description
	 * # Config and run block
	 * Configutation of the app
	 */


	angular
		.module('github-explorer')
		.config(configure)
		.run(runBlock);

	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.hashPrefix('!');

		// This is required for Browser Sync to work poperly
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


		$urlRouterProvider
			.otherwise('/home');

	}

	runBlock.$inject = ['$rootScope'];

	function runBlock($rootScope) {
		'use strict';

		console.log('AngularJS run() function...');
	}


})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.module:explorerModule
	 * @description
	 * # explorerModule
	 * Module of the app
	 */

  	angular.module('explorer', []);

})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.module:homeModule
	 * @description
	 * # homeModule
	 * Module of the app
	 */

  	angular.module('home', []);

})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.module:statisticsModule
	 * @description
	 * # statisticsModule
	 * Module of the app
	 */

  	angular.module('statistics', ['chart.js']);

})();

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

'use strict';

/**
 * @ngdoc function
 * @name app.route:homeRoute
 * @description
 * # homeRoute
 * Route of the app
 */

angular.module('home')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('home', {
				url:'/home',
				templateUrl: 'app/modules/home/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm'
			});


	}]);

'use strict';

/**
 * @ngdoc function
 * @name app.route:statisticsRoute
 * @description
 * # statisticsRoute
 * Route of the app
 */

angular.module('statistics')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('statistics', {
				url:'/statistics',
				templateUrl: 'app/modules/statistics/statistics.html',
				controller: 'StatisticsCtrl',
				controllerAs: 'vm'
			});


	}]);

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:explorerCtrl
	* @description
	* # explorerCtrl
	* Controller of the app
	*/

  	angular
		.module('explorer')
		.controller('ExplorerCtrl', Explorer);

		Explorer.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Explorer() {
			/*jshint validthis: true */
			var vm = this;

		}

})();

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:homeCtrl
	* @description
	* # homeCtrl
	* Controller of the app
	*/

  	angular
		.module('home')
		.controller('HomeCtrl', Home);

		Home.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Home() {
			/*jshint validthis: true */
			var vm = this;

			vm.title = "Welcome to ";
			vm.boldTitle = "Github Explorer";
			vm.description = "Don't worry, be happy and don't forget to visit other pages from this app."
			vm.quotation = "Keep calm and eat some cour'get !";
		}

})();

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:statisticsCtrl
	* @description
	* # statisticsCtrl
	* Controller of the app
	*/

  	angular
		.module('statistics')
		.controller('StatisticsCtrl', Statistics);

		Statistics.$inject = ['$interval'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Statistics($interval) {
			/*jshint validthis: true */
			var vm = this;

			/* Bubble chart configurations
			* http://jtblin.github.io/angular-chart.js/ */
			vm.series = ['Series A', 'Series B'];
			vm.data = [
				[{
					x: 40,
					y: 10,
					r: 20
				}],
				[{
					x: 10,
					y: 40,
					r: 50
				}]
			];

		vm.options = {
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							max: 125,
							min: -125,
							stepSize: 10
						}
					}],
					yAxes: [{
						display: false,
						ticks: {
							max: 125,
							min: -125,
							stepSize: 10
						}
					}]
				}
			};

			createChart();
			$interval(createChart, 2000);

			function createChart () {
				vm.series = [];
				vm.data = [];
				for (var i = 0; i < 50; i++) {
					vm.series.push(`Series ${i}`);
					vm.data.push([{
						x: randomScalingFactor(),
						y: randomScalingFactor(),
						r: randomRadius()
					}]);
				}
			}

			function randomScalingFactor () {
				return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
			}

			function randomRadius () {
				return Math.abs(randomScalingFactor()) / 4;
			}
		}

})();

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

(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:homeService
	 * @description
	 * # homeService
	 * Service of the app
	 */

  	angular
		.module('home')
		.factory('HomeService', Home);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Home.$inject = ['$http'];

		function Home ($http) {

		}

})();

(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:statisticsService
	 * @description
	 * # statisticsService
	 * Service of the app
	 */

  	angular
		.module('statistics')
		.factory('StatisticsService', Statistics);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Statistics.$inject = ['$http'];

		function Statistics ($http) {

		}

})();
