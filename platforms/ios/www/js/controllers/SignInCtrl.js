angular.module('Piximony').controller('SignInCtrl', function($scope, $rootScope, $state, WebService, DataService, $translate) {
    
    $scope.init = function () {
        var user = DataService.getUser()
        if (user !== null) {
            WebService.set_token(user.access_token)
            $state.go('tab.ProjectsHome')
        }else{
            console.log("require login")
        }
    }

    $scope.lang = 'en'
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
     $scope.buttonText= "ID_SIGN_UP" // After click, returns to <complete registration>
    
     $scope.signUp = function(user) {
         console.log(">> SignInCtrl.signUp()");
         if(!$scope.isVisible){
              $scope.isVisible = !$scope.isVisible;
              $scope.buttonText = "ID_COMP_REGISTER";
         }else{
             console.log(">> SignInCtrl.signUp() Register");
             user.lang = $scope.lang
             WebService.create_user(user, function(result,info){
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
         $scope.buttonText = "ID_SIGN_UP";
         console.log("<< SignInCtrl.toggle()");
     };
    
    $scope.changeLang = function(lang) {
        $scope.lang = lang
        window.localStorage.setItem('lang',lang);
        $translate.use(lang);
        $state.go('signin');
    };
    
    })