'use strict';

describe('Component: ChartComponent', function() {
  // load the controller's module
  beforeEach(module('githubExplorerApp.chart'));

  var ChartComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ChartComponent = $componentController('chart', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
