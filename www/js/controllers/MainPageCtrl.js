angular.module('Piximony').controller('MainPageCtrl', function($scope, $state, $rootScope, $ionicHistory, WebService, DataService) {
    $scope.GoToProjectsHome = function() {
            console.log("** MainPageCtrl.GoToProjectsHome()");
            $state.go('ProjectsHome');
             WebService.get_user_projects(DataService.getUser().username,function (result, projects, next, previos, count) {
                if (result==true){
                    $rootScope.$broadcast('userProjects', projects)
                }else{
                    alert("Error in get_user_projects, pleaser try again!")
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
                  alert("Error in get_playing_projects, pleaser try again!")
              }
          })
    };


    
    $scope.logOut = function () {
        console.log("** MainPageCtrl.logOut()");
        DataService.clearStorage();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('signin');
    }
})    