angular.module('Piximony').controller('SignInCtrl', function($scope, $rootScope, $state, WebService, DataService) {
    
    $scope.init = function () {
        var user = DataService.getUser()
        if (user !== null) {
            WebService.set_token(user.access_token)
            $state.go('tab.ProjectsHome')
        }else{
            console.log("require login")
        }
    }

    $scope.signIn = function(user) {
     console.log(">> SignInCtrl.signIn()");

        WebService.login(user.username, user.password, function (result,info){
            if (result == true){
                user.username = ""
                user.password = ""
                DataService.saveUser(info)
                $state.go('tab.ProjectsHome')
            }else{
                alert("Your credentials are wrong")
            }
        })
         console.log("<< SignInCtrl.signIn()");
    };

     $scope.isVisible = false;
     $scope.buttonText= "Sign Up" // After click, returns to <complete registration>
    
     $scope.signUp = function(user) {
         console.log(">> SignInCtrl.signUp()");
         if(!$scope.isVisible){
              $scope.isVisible = !$scope.isVisible;
              $scope.buttonText = "Complete Registration";
         }else{
             console.log(">> SignInCtrl.signUp() Register");
             WebService.create_user(user.username, user.email, user.password, function(result,info){
                 if (result==true){
                     user.username = ""
                     user.password = ""
                     user.email = ""
                     user.repassword = ""
                     DataService.saveUser(info)
                     $state.go('tab.ProjectsHome')
                 }else{
                     alert("error::"+JSON.stringify(info))
                 }
             })
         }
         console.log("<< SignInCtrl.signUp()");
     };
    
     $scope.toggle = function() {
         console.log(">> SignInCtrl.toggle()");
         $scope.isVisible = !$scope.isVisible;
         $scope.buttonText = "Sign Up";
         console.log("<< SignInCtrl.toggle()");
     };

    })