angular.module('Piximony').controller('AccountCtrl', function($scope, $state, DataService, WebService, CacheService, $ionicHistory) {

    $scope.user = DataService.getUser()
    
    WebService.get_current_user_info($scope.user.username,function (result, info) {
        if(result){
            $scope.user = info
        }
    })
    
    $scope.logOut = function () {
        console.log("** MainPageCtrl.logOut()");
        DataService.clearStorage();
        CacheService.clearCache()
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('signin');
    }
    
});

