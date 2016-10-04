'use strict';

describe('Controller: ChartCtrl', function() {
  // load the controller's module
  beforeEach(module('githubExplorerApp.chart'));

  var ChartCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    ChartCtrl = $controller('ChartCtrl', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
