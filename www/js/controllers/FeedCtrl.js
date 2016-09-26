angular.module('Piximony').controller('FeedCtrl', function($scope, $state, DataService, WebService) {

    $scope.user = DataService.getUser()

    WebService.get_current_user_info(function (result, info) {
        if(result){
            console.log(JSON.stringify(info))
            $scope.user = info
        }
    })

});

