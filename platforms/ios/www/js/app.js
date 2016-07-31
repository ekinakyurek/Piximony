// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova']).config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(2);
   
    $stateProvider

        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

        .state('tab.ProjectsHome', {
            url: '/ProjectsHome',
            params: {'projects': {} },
            views: {
                'tab-ProjectsHome': {
                    templateUrl: 'templates/tab-ProjectsHome.html',
                    controller: 'ProjectsHomeCtrl'
                }
            }
        })
        .state('tab.PlayerHome', {
            url: '/PlayerHome',
            params: {'projects': {} },
            views: {
                'tab-PlayerHome': {
                    templateUrl: 'templates/tab-PlayerHome.html',
                    controller: 'PlayerHomeCtrl'
                }
            }
        })
        .state('tab.Account', {
            url: '/Account',
            views: {
                'tab-Account': {
                    templateUrl: 'templates/tab-Account.html',
                    controller: 'AccountCtrl'
                }
            }
        })

        .state('tab.QuestionsHome', {
            url: '/ProjectsHome/QuestionsHome',
            params: {'project': {} },
            views: {
                'tab-ProjectsHome': {
                    templateUrl: 'templates/tab-QuestionsHome.html',
                    controller: 'QuestionsHomeCtrl'
                }
            }
        })
        .state('MainPage', {
            url: '/MainPage',
            templateUrl: 'templates/MainPage.html',
            controller: 'MainPageCtrl'
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
}).directive('holdList', ['$ionicGesture', function($ionicGesture) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $ionicGesture.on('hold', function(e) {

                var content = element[0].querySelector('.item-content');

                var buttons = element[0].querySelector('.item-options');
                var buttonsWidth = buttons.offsetWidth;

                ionic.requestAnimationFrame(function() {
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    if (!buttons.classList.contains('invisible')) {
                        content.style[ionic.CSS.TRANSFORM] = '';
                        setTimeout(function() {
                            buttons.classList.add('invisible');
                        }, 250);
                    } else {
                        buttons.classList.remove('invisible');
                        content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                    }
                });

            }, element);
        }
    };
}]);
