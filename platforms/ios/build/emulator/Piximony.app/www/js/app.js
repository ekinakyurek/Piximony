// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova','pascalprecht.translate']).config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$translateProvider) {

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
        
        .state('tab.FriendsHome', {
            url: '/FriendsHome',
            views: {
                'tab-Account': {
                    templateUrl: 'templates/tab-FriendsHome.html',
                    controller: 'FriendsHomeCtrl'
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
    
    $translateProvider.translations('en', {
    //generic
    ID_CANCEL:              'Cancel',
    //sign-in.html
    ID_USERNAME:            'Username',
    ID_PASSWORD:            'Password',
    ID_RE_PASSWORD:         'Re-password',
    ID_E_MAIL:              'E-mail',
    ID_COMP_REGISTER:       'Complete Registration',
    ID_FORGOT_PASSWORD:     'Forgot password',
    ID_SIGN_IN:             'Sign-In',
    ID_SIGN_UP:             'Sign Up',
    //tab-ProjectsHome.html
    ID_EDIT:                'Edit',
    ID_PIXIMONIES:          'Piximonies',
    ID_REFRESH_HINT:        'Pull to refresh...',
    //new-project.html
    ID_NEW_PIXIMONY:        'New Piximony',
    ID_CREATE_PIXIMONY:     'Create',
    ID_NEW_PIXIMONY_HINT:   'Name your Piximony',
    //tab-Account.html
    ID_LANGUAGE:            'Language',
    ID_NAME:                'First Name',
    ID_LAST_NAME:           'Last Name',
    ID_ACCOUNT:             'Account',
    //tabs.html
    ID_FEED:                'Feed',
    ID_PLAY:                'Play',
    ID_CREATE:              'Create',
    ID_FRIENDS:             'Friends',
    ID_ME:                  'Me',
    });
 
    $translateProvider.translations('tr', {
    ID_CANCEL:              'İptal',
    //sign-in.html
    ID_USERNAME:            'Kullanıcı Adı',
    ID_PASSWORD:            'Parola',
    ID_RE_PASSWORD:         'Parola Tekrar',
    ID_E_MAIL:              'E-posta',
    ID_COMP_REGISTER:       'Kaydı Tamamla',
    ID_FORGOT_PASSWORD:     'Parolamı unuttum',
    ID_SIGN_IN:             'Giriş',
    ID_SIGN_UP:             'Kayıt',
    //tab-ProjectsHome.html
    ID_EDIT:                'Düzenle',
    ID_PIXIMONIES:          'Piximonyler',
    ID_REFRESH_HINT:         'Yenilemek için aşağıya çekin...',
    //new-project.html
    ID_NEW_PIXIMONY:        'Yeni Piximony',
    ID_CREATE_PIXIMONY:     'Yarat',
    ID_NEW_PIXIMONY_HINT:   'Piximony\'ine isim ver',
    //tab-Account.html
    ID_LANGUAGE:            'Dil',
    ID_NAME:                'Ad',
    ID_LAST_NAME:           'Soyad',
    ID_ACCOUNT:             'Hesap',
    //tabs.html
    ID_FEED:                'Bildirimler',
    ID_PLAY:                'Oyna',
    ID_CREATE:              'Ekle',
    ID_FRIENDS:             'Arkadaşlar',
    ID_ME:                  'Profil',
    });
    
    $translateProvider.translations('es', {
    ID_USERNAME:        'Username',
    ID_PASSWORD:        'Password',
    ID_RE_PASSWORD:     'Re-password',
    ID_E_MAIL:          'E-mail',
    ID_COMP_REGISTER:   'Complete Registration',
    ID_FORGOT_PASSWORD: 'Forgot password',
    ID_SIGN_IN:         'Sign-In',
    ID_SIGN_UP:         'Sign Up',
    ID_LANGUAGE:        'Language',
    ID_CANCEL:          'Cancel',
    ID_EDIT:            'Edit'
    });
    
    $translateProvider.translations('de', {
    ID_USERNAME:        'Username',
    ID_PASSWORD:        'Password',
    ID_RE_PASSWORD:     'Re-password',
    ID_E_MAIL:          'E-mail',
    ID_COMP_REGISTER:   'Complete Registration',
    ID_FORGOT_PASSWORD: 'Forgot password',
    ID_SIGN_IN:         'Sign-In',
    ID_SIGN_UP:         'Sign Up',
    ID_LANGUAGE:        'Language',
    ID_CANCEL:          'Cancel',
    ID_EDIT:            'Edit'
    });
    
    
    if (window.localStorage.getItem('lang')) {
    $translateProvider.preferredLanguage(window.localStorage.getItem('lang'));
    } else {
    $translateProvider.preferredLanguage('tr');
    };
 
  $translateProvider.useSanitizeValueStrategy('escape');
    

}).directive("imageSource", function (CacheService){
    return {
        link: function (scope, element, attrs){

            attrs.$observe('imageSource', function() {
                element.attr("src", CacheService.getCachedValue(attrs.imageSource, scope.isPLaying, attrs.isThumbnail));
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
