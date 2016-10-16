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

            var github = "https://api.github.com";
            var auth = "?access_token=";
            var author = "damienrochat";
            var repo = "TWEB-App-01";

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
            vm.watchStats = watchStats;
            vm.onClick = onClick;
            vm.datasetOverride = undefined;
            vm.options = undefined;

            // This function is called when the user gives a username and a
            // repo name
            function watchStats() {
                var error = false;
                if (!vm.userName) {
                    vm.userNameError = "You must provide a github username";
                    error = true;
                }
                if (!vm.repoName) {
                    vm.repoNameError = "You must provide a github repository name";
                    error = true;
                }

                if (!error) {
                    vm.userNameError = vm.repoNameError = undefined;
                    console.log(vm.userName + "/" + vm.repoName);

                    vm.labels = [];
                    vm.data = [[],[]];
                    vm.responseCallback = undefined;

                    /**
                     * Github API call to get the number of addition and deletions per week
                     */
                    $http({
                        method: 'GET',
                        url: '/api/github'
                    })
                        .then(function successCallback(response) {

                            $http({
                                method: 'GET',
                                url: github+'/repos/'+vm.userName+'/'+vm.repoName+'/stats/code_frequency'+auth+response.data.token
                            })
                                .then(function successCallback(response) {
                                    var addAndDelPerWeek = response.data;
                                    vm.responseCallback = "Number of additions and deletions per week for " + vm.userName + "/" + vm.repoName + " repo.";
                                    return addAndDelPerWeek;
                                })
                                .then(function(addAndDelPerWeek) {
                                    addAndDelPerWeek.forEach( function(value) {
                                        var date = new Date(value[0] * 1000);
                                        vm.labels.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()));
                                        vm.data[0].push(value[1]);
                                        vm.data[1].push(Math.abs(value[2]));
                                    });
                                })
                                .catch(function errorCallback(response){
                                    vm.responseCallback = "error " + response.status + " " + response.statusText +
                                        " : " + vm.userName + "/" + vm.repoName + " is not a valid repository.";
                                    console.log(response);
                                });

                    })
                    .catch(function errorCallback(response){
                        vm.responseCallback = "error " + response.status + " " + response.statusText + " : " + response.data + " ";
                        console.log(response);
                    });

                } else {
                    vm.labels = [];
                    vm.data = [[],[]];
                }
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
                            display: true,
                            position: 'right'
                        }
                    ]
                }
            };
        }

})();
