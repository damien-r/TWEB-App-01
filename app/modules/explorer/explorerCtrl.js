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
        vm.watchStats = watchStatsFromGithub; // Function call on user event
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
                    for(var value in data) {
                        displayHistory(value);
                    }
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
                        for(var repo in data) {
                            vm.repos.push(repo.name);
                        }
                    })
                    .catch(function(error){
                        displayError(error);
                    });
            }
        }

        /**
         * This function call a service to retrieve data from Github API
         * for the given repository.
         */
        function watchStatsFromGithub() {

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
                githubstatsservice.getGithubStats(vm.userName + '/' + vm.repoName)
                    .then(displayStats)
                    .then(displayHistory)
                    .catch(gettingStatsFailed);

                getTrends();
                getRequestsHistory();
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
