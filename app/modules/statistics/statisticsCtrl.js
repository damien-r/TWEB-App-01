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

    Statistics.$inject = ['historyservice', 'githubstatsservice', 'storedstatsservice', 'reposservice'];

    /*
    * recommend
    * Using function declarations
    * and bindable members up top.
    */
    function Statistics(historyservice,
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
        vm.getRepos = getReposFromUser;
        vm.emptyRepos = function () { vm.repos = []; };

        // Run this function when the page loads
        activate();

        function activate() {
            getRequestsHistory().then(function(){
                console.log("Activated history view");
            })
        }

        function getRequestsHistory() {
            return historyservice.getRequestsHistory()
                .then(function(data){
                    Array.prototype.forEach.call(data, value => {
                        displayHistory(value);
                    });
                });
        }

        function getReposFromUser(username) {
            if(username) {
                reposservice.getRepos(username)
                    .then(function(data) {
                        vm.repos = [];
                        Array.prototype.forEach.call(data, repo => {
                            vm.repos.push(repo.name);
                        });
                    })
                    .catch(function(error){
                        console.log(error);
                    })
            }
        }

        /**
         * This function call a service to retrieve data from Github API
         * for the given username and repository. It has a chain of promises
         * to display it and catch eventually errors
         * @param username is the github username provided by the user
         * @param repo is the github repo associated to the username. Also
         * provided by the user
         */
        function watchStatsFromGithub(username, repo) {

            // Check if the fields are filled
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
                // No error at this stage, Let's try to get github data
                vm.userNameError = vm.repoNameError = undefined;
                vm.responseCallback = undefined;

                // Call of our service to get github data
                githubstatsservice.getGithubStats(username, repo)
                    .then(displayStats)
                    .then(displayHistory)
                    .catch(gettingStatsFailed);
            } else {
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
            storedstatsservice.getStoredStats(id)
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
            vm.history.push({_id: document._id, date: document.date, repo: document.repo});
        }

        /**
         * This function is called when an error occurred during the fetch
         * github stats' process.
         * The most common error is that the repository the user requested
         * is not valid (it doesn't exist).
         * @param error is the error to display
         */
        function gettingStatsFailed(error){
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
