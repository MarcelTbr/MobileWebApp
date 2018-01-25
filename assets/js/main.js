

var app = angular.module('nysl', ['ngRoute','nysl.controllers']);


app.config(['$routeProvider' ,function($routeProvider) {
$routeProvider.when('/view1', {
    controller: 'Controller1',
    templateUrl: 'assets/partials/view1.html',
}).when('/home', {
    controller: 'HomeController',
    templateUrl: 'assets/partials/home.html',
}).when('/schedule', {
    controller: 'ScheduleController',
    templateUrl: 'assets/partials/schedule.html',
}).when('/view3', {
    controller: 'Controller3',
    templateUrl: 'assets/partials/view3.html',
});;


    $routeProvider.otherwise({redirectTo:'/home'});

}]);


app.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm) {
            $elm.on('click', function() {
                $("body").animate({scrollTop: $elm.offset().top}, "slow");
            });
        }
    }
});