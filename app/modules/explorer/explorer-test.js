(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:explorerTest
	 * @description
	 * # explorerTest
	 * Test of the app
	 */

	describe('explorer test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('github-explorer');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('ExplorerCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
