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
                Array.prototype.forEach.call(response.data.stats, value => {
                    var date = new Date(value[0] * 1000);
                    vm.labels.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()));
                    vm.data[0].push(value[1]);
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
