angular.module('Piximony').controller('MainPageCtrl', function($scope, $state, $rootScope, $ionicHistory, WebService, DataService,CacheService) {

   
    $scope.GoToProjectsHome = function() {
        console.log("** MainPageCtrl.GoToProjectsHome()");
        $state.go('ProjectsHome');
        WebService.get_user_projects(DataService.getUser().username,function (result, projects, next, previos, count) {
            if (result==true){
                $rootScope.$broadcast('userProjects', projects)
            }else{
                console.log("** MainPageCtrl.GoToProjectsHome() Error in get_user_projects, please try again!");
            }
        })
    };
    
    $scope.GoToPlayerHome = function() {
        console.log("** MainPageCtrl.GoToPlayerHome()");
        $state.go('PlayerHome');
        WebService.get_playing_projects(DataService.getUser().username, function(result,projects){
            if(result){
                $rootScope.$broadcast('projectsToPlay', projects)
            }else{
                console.log("** MainPageCtrl.GoToPlayerHome() Error in get_playing_projects, please try again!");
            }
        })
    };

    $scope.logOut = function () {
        console.log("** MainPageCtrl.logOut()");
        DataService.clearStorage();
        CacheService.clearCache()
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('signin');
    }
})    