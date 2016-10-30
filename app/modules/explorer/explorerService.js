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
