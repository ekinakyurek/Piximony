angular.module('Piximony').controller('AccountCtrl', function($scope, $state, DataService, WebService, CacheService, ImageService, $ionicHistory, $ionicActionSheet) {

    $scope.user = DataService.getUser()
    $scope.profile_image = undefined
    console.log(JSON.stringify($scope.user))

    WebService.get_current_user_info(function (result, info) {
        if(result){
            console.log(JSON.stringify(info))
            $scope.user = info
        }
    })

    $scope.updateMedia = function() {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take photo' },
                { text: 'Photo from library' }
            ],
            titleText: 'Update profile photo',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                $scope.updatePic(index);
            }
        });
        console.log("<< QuestionsHomeCtrl.UpdateMedia()");
    };
    
    $scope.updatePic = function(type) {
        $scope.hideSheet();
        ImageService.handleMediaDialog(type, function(result, name) {
            $scope.user.picture_url =  cordova.file.dataDirectory + name
            $scope.user.thumbnail_url =    cordova.file.dataDirectory + name
            $scope.profile_image = name
        });
        console.log("<< QuestionsHomeCtrl.updatePic()");
    };

    $scope.upload_picture_data = function(){
        WebService.upload_picture_data($scope.profile_image, $scope.user, function(result,data){
            if(result){
                $scope.user = data
            }

        })
    }


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

