angular.module('Piximony').controller('MainPageCtrl', function($scope, $state, DataService) {
        $scope.GoToProjectsHome = function() {
            console.log("** GoToProjectsHome()");
            $state.go('ProjectsHome');
        };

      $scope.GoToPlayerHome = function() {
       console.log("** GoToPlayerHome()");
             $state.go('PlayerHome');
       DataService.projectsToPlay().then(function(prjcts) {

           DataService.questionsToPlay().then(function(qstns){

           },function(error){
                alert("error: cannot find questions");
           });
       }, function(error) {
           alert("error: cannot find projects");
       });

      };

    })
    