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

		Statistics.$inject = ['$interval'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Statistics($interval) {
			/*jshint validthis: true */
			var vm = this;

			/* Bubble chart configurations
			* http://jtblin.github.io/angular-chart.js/ */
			vm.series = ['Series A', 'Series B'];
			vm.data = [
				[{
					x: 40,
					y: 10,
					r: 20
				}],
				[{
					x: 10,
					y: 40,
					r: 50
				}]
			];

		vm.options = {
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							max: 125,
							min: -125,
							stepSize: 10
						}
					}],
					yAxes: [{
						display: false,
						ticks: {
							max: 125,
							min: -125,
							stepSize: 10
						}
					}]
				}
			};

			createChart();
			$interval(createChart, 2000);

			function createChart () {
				vm.series = [];
				vm.data = [];
				for (var i = 0; i < 50; i++) {
					vm.series.push(`Series ${i}`);
					vm.data.push([{
						x: randomScalingFactor(),
						y: randomScalingFactor(),
						r: randomRadius()
					}]);
				}
			}

			function randomScalingFactor () {
				return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
			}

			function randomRadius () {
				return Math.abs(randomScalingFactor()) / 4;
			}
		}

})();
