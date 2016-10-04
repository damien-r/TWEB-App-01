'use strict';

describe('Controller: MainCtrl', function() {
  // load the controller's module
  beforeEach(module('githubExplorerApp.main'));

  var MainCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    MainCtrl = $controller('MainCtrl', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
