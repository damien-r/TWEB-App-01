/*!
* github-explorer - v0.0.1 - MIT LICENSE 2016-10-19. 
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
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'home',
        'explorer',
        'statistics',
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
            .otherwise('/');

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
                url:'/',
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
            vm.description = "Don't worry, be happy and don't forget to visit other pages from this app.";
            vm.quotation = "Keep calm and eat some courgettes !";
        }

})();

(function() {
    'use strict';

        Statistics.$inject = ['$http'];

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

        /*
        * recommend
        * Using function declarations
        * and bindable members up top.
        */
        function Statistics($http) {
            var IP_USER = "::1";
            var json = 'https://api.ipify.org?format=json';
            $http.get(json).then(function(result) {
                IP_USER = result.data.ip;
            }, function(e) {
                // We will consider that user is on localhsot
                // and won't display error
            });
            fetchHistory(IP_USER);

            /*jshint validthis: true */
            var vm = this;

            vm.labels = [];
            vm.series = ['Additions', 'Deletions'];
            vm.data = [[],[]];
            vm.userName = undefined;
            vm.userNameError = undefined;
            vm.repoName = undefined;
            vm.repoNameError = undefined;
            vm.responseCallback = undefined;
            vm.watchStats = watchStatsFromGithub;
            vm.onClick = onClick;
            vm.datasetOverride = undefined;
            vm.options = undefined;
            vm.displayStatsFromDB = displayStatsFromDB;
            vm.history = [];

            // This function is called when the user gives a username and a
            // repo name.
            function watchStatsFromGithub(username, repo) {
                var error = false;
                if (!username) {
                    vm.userNameError = "You must provide a github username";
                    error = true;
                }
                if (!repo) {
                    vm.repoNameError = "You must provide a github repository name";
                    error = true;
                }

                if (!error) {
                    vm.userNameError = vm.repoNameError = undefined;
                    vm.responseCallback = undefined;

                    // API call to get data of a given repository
                    $http.get('/api/githubStats/' + username + "/" + repo)
                        .then(displayStats)
                        .then(displayHistory)
                        .catch(function errorCallback(response){
                            vm.labels = [];
                            vm.data = [[],[]];
                            vm.responseCallback = "error " + response.status + " " + response.statusText +
                                " : " + vm.userName + "/" + vm.repoName + " is not a valid repository.";
                        });
                } else {
                    vm.labels = [];
                    vm.data = [[],[]];
                }
            }

            // Display stats of a given id. This id represents a document
            // in a mongoDB collection.
            function displayStatsFromDB(id) {
                $http.get('/api/githubStats/' + id)
                    .then(displayStats);
            }

            // Display statistics stored in the response parameter
            function displayStats(response) {
                vm.responseCallback = "Number of additions and deletions per week for " + response.data.repo + " repo.";
                vm.labels = [];
                vm.data = [[],[]];
                console.log(response);
                Array.prototype.forEach.call(response.data.stats, value => {
                    var date = new Date(value[0] * 1000);
                    // Push the date representing the week
                    vm.labels.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()));
                    // Push additions
                    vm.data[0].push(value[1]);
                    // Push Deletions. Math.abs() for having positive values.
                    vm.data[1].push(Math.abs(value[2]));
                });
                return response.data;
            }

            function displayHistory(document) {
                vm.history.push({_id: document._id, date: document.date, repo: document.repo});
            }

            function fetchHistory(ipUser) {
                $http.get('/api/history/' + ipUser)
                    .then(function successCallback(response){
                        Array.prototype.forEach.call(response.data, value => {
                            displayHistory(value);
                        });
                    })
                    .catch(function errorCallback(response){
                        // Something went wrong...
                    });
            }

            function onClick (points, evt) {
                console.log(points, evt);
            }
            vm.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            vm.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            display: false,
                            position: 'right'
                        }
                    ]
                }
            };
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

        Home.$inject = [];

        function Home () {

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
