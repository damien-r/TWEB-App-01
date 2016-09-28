angular.module('github-explorer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/modules/explorer/explorer.html',
    "<section class=\"wrapper style4 container\">\n" +
    "	<div class=\"content\">\n" +
    "		<section>\n" +
    "\n" +
    "			<header>\n" +
    "				<h3>Coming soon</h3>\n" +
    "				<p>Stay tuned</p>\n" +
    "			</header>\n" +
    "\n" +
    "		</section>\n" +
    "	</div>\n" +
    "</section>\n"
  );


  $templateCache.put('app/modules/home/home.html',
    "<header class=\"special container\">\n" +
    "	<span class=\"icon fa-desktop\"></span>\n" +
    "	<h2>{{ vm.title }}<strong>{{ vm.boldTitle }}</strong></h2>\n" +
    "	<p>{{ vm.description }}</p>\n" +
    "	<p>{{ vm.quotation }}</p>\n" +
    "</header>\n"
  );


  $templateCache.put('app/modules/statistics/statistics.html',
    "<section class=\"wrapper style4 container\">\n" +
    "	<div class=\"content\">\n" +
    "		<section>\n" +
    "\n" +
    "			<header>\n" +
    "				<h3>Let's make some bubbles</h3>\n" +
    "				<canvas id=\"base\" class=\"chart-bubble\" chart-data=\"vm.data\" chart-series=\"vm.series\" chart-options=\"vm.options\">\n" +
    "				</canvas>\n" +
    "			</header>\n" +
    "\n" +
    "		</section>\n" +
    "	</div>\n" +
    "</section>\n"
  );

}]);
