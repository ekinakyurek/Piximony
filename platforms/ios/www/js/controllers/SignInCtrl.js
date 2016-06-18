angular.module('Piximony').controller('SignInCtrl', function($scope, $state) {
     $scope.signIn = function(user) {
     console.log(">> SignInCtrl.signIn()");
     Parse.User.logIn(user.username, user.password, {
         success: function(PFuser) {
           $state.go('MainPage');
           $scope.user=PFuser;
         },
         error: function(PFuser, error) {
            alert("Error: " + error.code + " " + error.message);
         }
     });
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

         var PFuser = new Parse.User();
         PFuser.set("username", user.username);
         PFuser.set("password", user.password);
         PFuser.set("email", user.email);

         PFuser.signUp(null, {
                 success: function(PFuser) {

                 $state.go('MainPage');
                 $scope.user=PFuser;
                 },
                 error: function(PFuser, error) {
                 // Show the error message somewhere and let the user try again.
                 alert("Error: " + error.code + " " + error.message);
                 }
                     });
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