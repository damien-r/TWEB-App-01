/*!
* github-explorer - v0.0.1 - MIT LICENSE 2016-10-30. 
* @author Les courgettes
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
        'explorer'
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
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.hashPrefix('!');

        // This is required for Browser Sync to work poperly
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // Default route
        $urlRouterProvider.otherwise('/');

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

    angular.module('explorer', ['chart.js']);

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

'use strict';

/**
 * @ngdoc function
 * @name app.route:explorerRoute
 * @description
 * # explorerModuleRoute
 * Route of the app
 */

angular.module('explorer')
    .config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider
            .state('explorer', {
                url:'/explorer',
                templateUrl: 'modules/explorer/explorer.html',
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
                templateUrl: 'modules/home/home.html',
                controller: 'HomeCtrl',
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

    Explorer.$inject = ['historyservice', 'trendsservice', 'githubstatsservice', 'storedstatsservice', 'reposservice'];

    /*
    * recommend
    * Using function declarations
    * and bindable members up top.
    */
    function Explorer(historyservice,
                        trendsservice,
                        githubstatsservice,
                        storedstatsservice,
                        reposservice) {


        /*jshint validthis: true */
        var vm = this;

        // Variables for displaying the graph
        vm.labels = [];
        vm.series = ['Additions', 'Deletions'];
        vm.data = [[],[]];
        vm.datasetOverride = undefined;
        vm.options = undefined;
        vm.onClick = onClick;

        // Variables for user interactions
        vm.userName = undefined;
        vm.userNameError = undefined;
        vm.repoName = undefined;
        vm.repoNameError = undefined;
        vm.responseCallback = undefined;
        vm.watchStats = watchStatsFromGithubByUserAndRepo; // Function call on user event
        vm.watchStatsFromTrends = watchStatsFromGithub; // Function call on user event
        vm.displayStatsFromDB = displayStatsFromDB; // Function call on user event
        vm.history = [];
        vm.repos = [];
        vm.trends = [];
        vm.getRepos = getReposFromUser;
        vm.emptyRepos = function () { vm.repos = []; };

        // Run this function when the page loads
        activate();

        function activate() {
            getRequestsHistory().then(function() {
                console.log("Activated history view");
            });
            getTrends().then(function() {
                console.log("Activated trends view");
            });
        }

        function getRequestsHistory() {
            vm.history = [];
            return historyservice
                .getRequestsHistory()
                .then(function(data) {
                    Array.prototype.forEach.call(data, value => {
                        displayHistory(value);
                    });
                })
                .catch(function(error){
                    gettingStatsFailed(error);
                });
        }

        function getTrends() {
            vm.trends = [];
            return trendsservice
                .getTrends()
                .then(function(data) {
                    Array.prototype.forEach.call(data, value => {
                        displayTrend(value);
                    });
                });
        }

        function getReposFromUser(username) {
            if (username) {
                reposservice.getRepos(username)
                    .then(function(data) {
                        vm.repos = [];
                        Array.prototype.forEach.call(data, repo => {
                            vm.repos.push(repo.name);
                        });
                    })
                    .catch(function(error){
                        displayError(error);
                    });
            }
        }

        /**
         * This function call a service to retrieve data from Github API
         * for the given repository.
         * @param repo is the github user.
         * @param repo is the github repo associated to the user.
         */
        function watchStatsFromGithubByUserAndRepo(user, repo) {

            // Check if the fields are filled
            var error = false;
            if (!vm.userName) {
                vm.userNameError = "You must provide a github user";
                error = true;
            }
            if (!vm.repoName) {
                vm.repoNameError = "You must provide a github repository";
                error = true;
            }

            if (!error) {
                // No error at this stage, Let's try to get github data
                vm.userNameError = vm.repoNameError = undefined;
                vm.responseCallback = undefined;
                vm.errorMessage = undefined;

                // Call of our service to get github data
                watchStatsFromGithub(user + '/' + repo);
            }
            else {
                // Empty the graph if an error has occurred.
                // This is useful when the graph was already displayed when
                // the error occurred
                vm.labels = [];
                vm.data = [[],[]];
            }
        }

        /**
         * This function call a service to retrieve data from Github API
         * for the given repository.
         * @param repo is the github repo.
         */
        function watchStatsFromGithub(repo) {
            githubstatsservice.getGithubStats(repo)
                .then(displayStats)
                .then(displayHistory)
                .then(getTrends)
                .then(getRequestsHistory)
                .catch(gettingStatsFailed);
        }

        /**
         * Display stats for a given id. This id represents a document
         * in a mongoDB collection.
         * @param id
         */
        function displayStatsFromDB(id) {
            storedstatsservice
                .getStoredStats(id)
                .then(displayStats)
                .catch(gettingStatsFailed);
        }

        /**
         * Display statistics stored in the data parameter
         * @param data is a JSON payload. data.stats is an array where each cell
         * contains the github repository name, the number of deletions and
         * additions per week for this repo and the date of the week
         */
        function displayStats(data) {
            vm.responseCallback = "Number of additions and deletions per week for " +
                data.repo + " repo.";
            console.log(data);

            // Ensure that current vm variables are empty
            vm.labels = [];
            vm.data = [[],[]];

            Array.prototype.forEach.call(data.stats, value => {
                // Push the date representing the week in DD/MM/YYYY format
                var date = new Date(value[0] * 1000);
                vm.labels.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()));

                // Push additions
                vm.data[0].push(value[1]);

                // Push Deletions.
                // Math.abs() is for having positive values on the graph
                vm.data[1].push(Math.abs(value[2]));
            });

            return data;
        }

        /**
         * Store the requested github stats in the vm.history variable.
         * Angular will manage to display it for the user.
         * @param document is the requested github stats to store. It has
         * a JSON format.
         */
        function displayHistory(document) {
            vm.history.push({ _id: document._id, date: document.date, repo: document.repo });
        }

        /**
         * Store the requested github stats in the vm.trends variable.
         * Angular will manage to display it for the user.
         * @param document is the requested github stats to store. It has
         * a JSON format.
         */
        function displayTrend(document) {
            vm.trends.push({ repo: document._id, count: document.count });
        }

        /**
         * This function is called when an error occurred during the fetch
         * github stats' process.
         * The most common error is that the repository the user requested
         * is not valid (it doesn't exist).
         * @param error is the error to display
         */
        function gettingStatsFailed(error) {
            console.log("gettingStatsFailed");
            console.log(error);
            vm.labels = [];
            vm.data = [[],[]];
            vm.responseCallback = "error " + error.status + " " + error.statusText +
                " : " + vm.userName + "/" + vm.repoName + " is not a valid repository.";
        }

        // Configurations for managing the graph
        // Source : https://jtblin.github.io/angular-chart.js/#line-chart
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
                        position: 'left'
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

    /**
     * @ngdoc function
     * @name app.service:explorerService
     * @description
     * # explorerService
     * Service of the app
     */

    angular
        .module('explorer')
        .factory('historyservice', historyservice)
        .factory('trendsservice', trendsservice)
        .factory('githubstatsservice', githubstatsservice)
        .factory('storedstatsservice', storedstatsservice)
        .factory('reposservice', reposservice);

        historyservice.$inject = ['$http'];
        trendsservice.$inject = ['$http'];
        githubstatsservice.$inject = ['$http'];
        storedstatsservice.$inject = ['$http'];
        reposservice.$inject = ['$http'];

        function historyservice($http) {
            return {
                getRequestsHistory: getRequestsHistory
            };

            function getRequestsHistory() {
                return $http.get('/api/history')
                    .then(getHistoryComplete)
                    .catch(getHistoryFailed);

                function getHistoryComplete(response) {
                    return response.data;
                }

                function getHistoryFailed(error) {
                    console.log('Failed requesting history.' + error.data);
                    throw error;
                }
            }
        }

        function trendsservice($http) {
            return {
                getTrends: getTrends
            };

            function getTrends() {
                return $http.get('/api/trends')
                    .then(getTrendsComplete)
                    .catch(getTrendsFailed);

                function getTrendsComplete(response) {
                    return response.data;
                }

                function getTrendsFailed(error) {
                    console.log('Failed requesting trends.' + error.data);
                    throw error;
                }
            }
        }

        function githubstatsservice ($http) {
            return {
                getGithubStats: getGithubStats
            };

            function getGithubStats(repo) {
                return $http.get('/api/githubstats/' + repo)
                    .then(getGithubStatsComplete)
                    .catch(getGithubStatsFailed);

                function getGithubStatsComplete(response) {
                    return response.data;
                }

                function getGithubStatsFailed(error) {
                    console.log("Failed getting github stats for " + repo);
                    throw error;
                }
            }
        }

        function storedstatsservice($http) {
            return {
                getStoredStats: getStoredStats
            };

            function getStoredStats(id) {
                return $http.get('/api/githubStats/' + id)
                    .then(getStoredStatsComplete)
                    .catch(getStoredStatsFailed);

                function getStoredStatsComplete(response) {
                    return response.data;
                }

                function getStoredStatsFailed(error) {
                    console.log("Faileld getting stats from DB.");
                    throw error;
                }
            }
        }

        function reposservice($http) {
            return {
                getRepos: getRepos
            };

            function getRepos(username) {
                return $http.get('/api/repos/' + username)
                    .then(getReposComplete)
                    .catch(getReposFailed);

                function getReposComplete(response) {
                    return response.data;
                }
                function getReposFailed(error) {
                    console.log("Faileld getting repos from user " + username);
                    throw error;
                }
            }
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
