angular.module('github-explorer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/modules/explorer/explorer.html',
    "<section class=\"wrapper style4 container\">\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <header>\r" +
    "\n" +
    "                <h3>Coming soon</h3>\r" +
    "\n" +
    "                <p>Stay tuned</p>\r" +
    "\n" +
    "            </header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </section>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</section>\r" +
    "\n"
  );


  $templateCache.put('app/modules/home/home.html',
    "<header class=\"special container\">\r" +
    "\n" +
    "    <span class=\"icon fa-desktop\"></span>\r" +
    "\n" +
    "    <h2>{{ vm.title }}<strong>{{ vm.boldTitle }}</strong></h2>\r" +
    "\n" +
    "    <p>{{ vm.description }}</p>\r" +
    "\n" +
    "    <p>{{ vm.quotation }}</p>\r" +
    "\n" +
    "</header>\r" +
    "\n"
  );


  $templateCache.put('app/modules/statistics/statistics.html',
    "<section class=\"wrapper style4 container\">\n" +
    "    <div class=\"content\">\n" +
    "        <section>\n" +
    "\n" +
    "            <header>\n" +
    "                <h3>Github repo</h3>\n" +
    "                <p>This graph shows the number of additions and deletions per week for the {{ vm.repoName }} repo.</p>\n" +
    "                <canvas id=\"line\" class=\"chart chart-line\" chart-data=\"vm.data\"\n" +
    "                        chart-labels=\"vm.labels\" chart-series=\"vm.series\" chart-options=\"vm.options\"\n" +
    "                        chart-dataset-override=\"vm.datasetOverride\" chart-click=\"vm.onClick\" chart-colors=\"vm.colors\">\n" +
    "                </canvas>\n" +
    "            </header>\n" +
    "\n" +
    "            <!--<header>\n" +
    "                <h3>Let's make some bubbles</h3>\n" +
    "                <canvas id=\"base\" class=\"chart-bubble\" chart-data=\"vm.data\" chart-series=\"vm.series\" chart-options=\"vm.options\">\n" +
    "                </canvas>\n" +
    "            </header>-->\n" +
    "\n" +
    "        </section>\n" +
    "    </div>\n" +
    "</section>\n"
  );

}]);
