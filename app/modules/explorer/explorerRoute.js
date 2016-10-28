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
