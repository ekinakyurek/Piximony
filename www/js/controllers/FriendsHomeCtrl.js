angular.module('Piximony').controller('FriendsHomeCtrl', function($scope, $state, DataService, WebService) {
    /**
     * Created by ekin on 05/09/16.
     */


    $scope.getMyFriends = function() {
        console.log(">> FriendsHomeCtrl.getMyFriends()");
        WebService.get_all_users(function (result,users) {
            if (result==true){
                console.log(JSON.stringify(users))
                $scope.friends = []
                $scope.requests = []
                $scope.requesteds = []
                $scope.others = []

                for (var i in users){
                    if (users[i].is_friend){
                        $scope.friends.push(users[i])
                    }else if (users[i].is_requesting){
                        $scope.requests.push(users[i])
                    }else if (users[i].is_requested){
                        $scope.requesteds.push(users[i])
                    }else{
                        $scope.others.push(users[i])
                    }
                }

                console.log($scope.friends.length)
            }else{
                console.log(JSON.stringify(response))
            }
        })
        console.log("<< FriendsHomeCtrl.getMyFriends()");
    };

    $scope.friends = []
    $scope.requests = []
    $scope.requesteds = []
    $scope.others = []
    $scope.getMyFriends()

    $scope.accept_friendship = function(user){

        WebService.accept_friendship(user.username, function(result){
            if (result){
                $scope.friends.unshift(user)
                $scope.requests.splice($scope.requests.indexOf(user),1);
            }

        })

    }

    $scope.request_friendship = function(user) {

        WebService.request_friendship(user.username,function (result) {
            if (result) {
                $scope.requesteds.unshift(user)
                $scope.others.splice($scope.others.indexOf(user),1);
            }
        })
    };
})
