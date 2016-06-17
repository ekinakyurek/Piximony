// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova']).config(function($stateProvider, $urlRouterProvider) {

        //Parse.initialize("Cf8RgFxwJbxS93aUxTNYtJbzcxRpkywAwNu4aoNb", "qWAIcupqoM1QV8kbW0MblWUOZzasYBBgLrrLzA32");
        Parse.initialize("iZdpAD7vYS44lPB2qLDedAsl8Fn5XUwtNkHJjYN4", "9OCTXn0Y0kMlRfpPtpeKGGgIevY7waMMUuwrHmpU");
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
                params: {'projectId': null}
            })
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'SignInCtrl'
            });


        $urlRouterProvider.otherwise('/sign-in');

    })