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
            var token = "";
            var author = "damienrochat";
            var repo = "TWEB-App-01";

            // $http.get( "/api/github").success(function( data ) {
            //     console.log(data);
            //     token = data.data.token;
            // }).catch(function errorCallback(response){
            //     console.log(response);
            // });

            $http({
                method: 'GET',
                url: '/api/github'
            })
                .then(function successCallback(response) {
                    return response.data;
                })
                .then(function (saveToken) {
                    token = saveToken.token;
                })
                .catch(function errorCallback(response){
                    console.log(response);
                });



            /*jshint validthis: true */
            var vm = this;

            vm.labels = [];
            vm.series = ['Additions', 'Deletions'];
            vm.data = [[],[]];
            vm.repoName = repo;

            console.log(token);

            /**
             * Github API call to get the number of addition and deletions per week
             */
            $http({
                method: 'GET',
                url: github+'/repos/'+author+'/'+repo+'/stats/code_frequency'+auth+token
            })
                .then(function successCallback(response) {
                   console.log(response.data);
                    return response.data;
                })
                .then(function (addAndDelPerWeek){
                    addAndDelPerWeek.forEach(function (value) {
                        var date = new Date(value[0] * 1000);
                        vm.labels.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()));
                        vm.data[0].push(value[1]);
                        vm.data[1].push(Math.abs(value[2]));
                    });
                })
                .catch(function errorCallback(response){
                    console.log(response);
                });

            vm.onClick = function (points, evt) {
                console.log(points, evt);
            };
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
