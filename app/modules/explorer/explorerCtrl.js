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

		Explorer.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Explorer() {
			/*jshint validthis: true */
			var vm = this;

		}

})();
