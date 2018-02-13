

var app = angular.module('nysl', ['ngRoute', 'nysl.controllers']);


app.config(['$routeProvider' ,function($routeProvider) {
$routeProvider.when('/chat/:id', {
    controller: 'Controller1',
    templateUrl: 'assets/partials/chat.html',
}).when('/home', {
    controller: 'HomeController',
    templateUrl: 'assets/partials/home.html',
}).when('/schedule', {
    controller: 'ScheduleController',
    templateUrl: 'assets/partials/schedule.html',
}).when('/game/:id', {
    controller: 'GameController',
    templateUrl: 'assets/partials/game-view.html',
});;


    $routeProvider.otherwise({redirectTo:'/home'});

}]);


app.directive('goBack', function($window) {
    return {
        restrict: 'A',
        link: function(scope, el) {
            $(el[0]).on('click', function() {

               $window.history.back();

            });

        }
    }
});

app.directive('goFwd', function($window) {
    return {
        restrict: 'A',
        link: function(scope, el) {
            $(el[0]).on('click', function() {

                $window.history.forward();

            });

        }
    }
});


app.directive('scrollTo', function () {
    return  function (scope, element, attributes) {

            console.info("element", element);

            element[0].addEventListener('click', function () {

                setTimeout(function(){
                    window.scrollTo(0, element[0].offsetTop + 100)
                }, 150);

            }, false);


        }

});
app.directive('scrollToBottom', function ($window) {
    return  function (scope, element) {

        element[0].addEventListener('click', function () {
            console.info("element", element);
            setTimeout(function(){
                $window.scrollTo(0, document.body.scrollHeight)
            }, 100);

        }, false);


    }

});