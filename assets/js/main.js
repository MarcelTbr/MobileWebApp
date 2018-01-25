'use strict';

var app = angular.module('nysl', ['ngRoute','nysl.controllers']);


app.config(['$routeProvider' ,function($routeProvider) {
$routeProvider.when('/view1', {
    controller: 'Controller1',
    templateUrl: 'assets/partials/view1.html',
}).when('/view2', {
    controller: 'Controller2',
    templateUrl: 'assets/partials/view2.html',
}).when('/view3', {
    controller: 'Controller3',
    templateUrl: 'assets/partials/view3.html',
});;


    $routeProvider.otherwise({redirectTo:'/view1'});

}]);
