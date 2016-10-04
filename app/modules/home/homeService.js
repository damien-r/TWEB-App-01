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
