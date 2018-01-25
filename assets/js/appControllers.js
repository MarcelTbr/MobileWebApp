angular.module('nysl.controllers', []).controller('Controller1'
,function($scope){
    $scope.message="Hello, world";
}).controller('Controller2',function($scope){
    $scope.now=new Date();
});
