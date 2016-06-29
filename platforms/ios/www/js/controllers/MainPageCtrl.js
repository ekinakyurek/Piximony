angular.module('Piximony').controller('MainPageCtrl', function($scope, $state, $rootScope, DataService) {
    $scope.GoToProjectsHome = function() {
            console.log("** MainPageCtrl.GoToProjectsHome()");
            $state.go('ProjectsHome');
    };
    $scope.GoToPlayerHome = function() {
          console.log("** MainPageCtrl.GoToPlayerHome()");
          $state.go('PlayerHome');
          WebService.get_playing_projects($rootScope.user.username, function(result,projects){
              if(result){
                  $rootScope.$broadcast('projectsToPlay', projects)
              }
          })
    };
})    