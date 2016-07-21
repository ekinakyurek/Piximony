// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova']).config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(2);
   
    $stateProvider
        .state('MainPage', {
            url: '/MainPage',
            templateUrl: 'templates/MainPage.html',
            controller: 'MainPageCtrl'
        })
        .state('PlayerHome', {
            url: '/PlayerHome',
            templateUrl: 'templates/PlayerHome.html',
            controller: 'PlayerHomeCtrl'
        })
        .state('ProjectsHome', {
            url: '/ProjectsHome',
            templateUrl: 'templates/ProjectsHome.html',
            controller: 'ProjectsHomeCtrl'
        })
        .state('QuestionsHome', {
            url: '/QuestionsHome',
            templateUrl: 'templates/QuestionsHome.html',
            controller: 'QuestionsHomeCtrl',
            params: {'project': {} }
        })
        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
        });


    $urlRouterProvider.otherwise('/sign-in');

}).directive("imageSource", function (CacheService){
    return {
        link: function (scope, element, attrs){

            attrs.$observe('imageSource', function() {
                element.attr("src", CacheService.getCachedValue(attrs.imageSource, scope.isPLaying));
            })

        }
    };
});
