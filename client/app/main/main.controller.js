'use strict';
const angular = require('angular');

/*@ngInject*/
export function mainCtrl() {
  //this.message = 'Hello';

  //mainCtrl.$inject = [];

  /*
   * recommend
   * Using function declarations
   * and bindable members up top.
   */

    /* jshint validthis: true */
    var vm = this;

    vm.title = "Welcome to ";
    vm.boldTitle = "Github Explorer";
    vm.description = "Don't worry, be happy and don't forget to visit other pages from this app."
    vm.quotation = "Keep calm and eat some cour'get !";
}

export default angular.module('githubExplorerApp.main', [])
  .controller('MainCtrl', mainCtrl)
  .name;


// (function() {
//   'use strict';
//
//   /**
//    * @ngdoc function
//    * @name app.controller:mainCtrl
//    * @description
//    * # homeCtrl
//    * Controller of the app
//    */
//
//   angular
//     .module('githubExplorerApp.main')
//     .controller('mainCtrl', Home);
//
//   Home.$inject = [];
//
//   /*
//    * recommend
//    * Using function declarations
//    * and bindable members up top.
//    */
//
//   function Home() {
//     /*jshint validthis: true */
//     var vm = this;
//
//     vm.title = "Welcome to ";
//     vm.boldTitle = "Github Explorer";
//     vm.description = "Don't worry, be happy and don't forget to visit other pages from this app."
//     vm.quotation = "Keep calm and eat some cour'get !";
//   }
//
// })();
