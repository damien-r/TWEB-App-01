'use strict';
const angular = require('angular');

/*@ngInject*/
export function chartController() {
  this.message = 'Hello';
}

export default angular.module('githubExplorerApp.chart', [])
  .controller('ChartController', chartController)
  .name;
