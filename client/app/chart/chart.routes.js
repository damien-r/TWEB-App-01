'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('chart', {
      url: '/chart',
      template: '<chart></chart>'
    });
}
