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
    "\n" +
    "<header class=\"special container\">\n" +
    "    <span class=\"icon fa-area-chart\"></span>\n" +
    "    <h2>Github repository <strong>statistics</strong></h2>\n" +
    "    <p>This graph shows the number of additions and deletions per week <br>\n" +
    "        for a given github username or organization and one of his public repository.</p>\n" +
    "</header>\n" +
    "\n" +
    "<section class=\"wrapper style4 special container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"6u 12u(narrower)\">\n" +
    "            <section>\n" +
    "                <header>\n" +
    "                    <h3>Provide the data</h3>\n" +
    "                </header>\n" +
    "                <form ng-submit=\"vm.watchStats(vm.userName, vm.repoName)\" >\n" +
    "                    <div class=\"row 50%\">\n" +
    "                        <div class=\"6u 12u(mobile)\">\n" +
    "                            <input type=\"text\" ng-model=\"vm.userName\" name=\"username\" placeholder=\"Github username\" />\n" +
    "                            <small class=\"warning\">{{ vm.userNameError }}</small>\n" +
    "                        </div>\n" +
    "                        <div class=\"6u 12u(mobile)\">\n" +
    "                            <input type=\"text\" ng-model=\"vm.repoName\" name=\"reponame\" placeholder=\"Github repository name\" />\n" +
    "                            <small class=\"warning\">{{ vm.repoNameError }}</small>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"12u\">\n" +
    "                            <ul class=\"buttons\">\n" +
    "                                <li><input type=\"submit\" class=\"special\" value=\"Watch statistics\" /></li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </section>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"6u 12u(narrower)\">\n" +
    "\n" +
    "            <section>\n" +
    "                <header>\n" +
    "                    <h3>Your history</h3>\n" +
    "                </header>\n" +
    "                <!--<p>Select a github repo in the list</p>-->\n" +
    "                <!-- TODO: ng-repeat -->\n" +
    "                <ul>\n" +
    "                    <li ng-repeat=\"history in vm.history | orderBy:vm.date:true | limitTo:7\">\n" +
    "                        {{ history.date | date:\"dd/MM/yyyy 'at' hh:mma\" }} -\n" +
    "                        <a href=\"\" ng-click=\"vm.displayStatsFromDB(history._id)\">\n" +
    "                            {{ history.repo}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <!--\n" +
    "                <select>\n" +
    "                    <option value=\"volvo\">No queries for now</option>\n" +
    "                </select>\n" +
    "                -->\n" +
    "            </section>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <br>\n" +
    "        <p><strong>{{ vm.responseCallback }}</strong></p>\n" +
    "        <canvas id=\"line\" class=\"chart chart-line\" chart-data=\"vm.data\"\n" +
    "                chart-labels=\"vm.labels\" chart-series=\"vm.series\" chart-options=\"vm.options\"\n" +
    "                chart-click=\"vm.onClick\" chart-colors=\"vm.colors\">\n" +
    "        </canvas>\n" +
    "    </div>\n" +
    "</section>\n"
  );

}]);
