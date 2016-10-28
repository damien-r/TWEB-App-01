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
