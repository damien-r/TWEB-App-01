'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './chart.routes';

export class ChartComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('githubExplorerApp.chart', [uiRouter])
  .config(routes)
  .component('chart', {
    template: require('./chart.html'),
    controller: ChartComponent,
    controllerAs: 'chartCtrl'
  })
  .name;
