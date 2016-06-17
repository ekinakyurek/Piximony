angular.module('Piximony').controller('ProjectsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
      //   $scope.projects = [
      //     {id: 1, name: 'Volkan\'s project 1', img: 'img/image-placeholder.png'},
      //     {id: 2, name: 'Martin\'s project 2', img: 'img/image-placeholder.png'},
      //     {id: 3, name: 'Atlas\'s project 3', img: 'img/image-placeholder.png'}
      // ];

      $scope.projects = DataService.projects();

      // Create and load the Modal
      $ionicModal.fromTemplateUrl('templates/new-project.html', function(modal) {
        $scope.projectModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      $scope.home = function() {
          $state.go('MainPage');
      };

      // Called when the form is submitted
      $scope.createProject = function(project) {
        var id = $scope.projects.length+1;
        console.log(">> createProject() with id: " + id);

        $scope.projects.push({
            id: id,
            name: project.name,
            img: 'img/image-placeholder.png',
            url : 'img/image-placeholder.png',
            remote: 'img/image-placeholder.png',
            username: DataService.Currentusername,
            owner: Parse.User.current()
        });

        if(project.name.length > 20){
            alert("Too long project name : " + project.name);
        }
        else{
        $scope.projectModal.hide();
        DataService.storeProjects($scope.projects);
        DataService.pushProject({ id: id, name: project.name, img: 'img/image-placeholder.png', url : 'img/image-placeholder.png', remote : 'img/image-placeholder.png', username: DataService.Currentusername, owner:Parse.User.current()});
        project.name = "";
        }
      };

      $rootScope.$on('HomeBtnClicked', function (event, data) {
        console.log('** HomeBtnClicked recieved');
        $scope.projects = DataService.projects();
      });

    $rootScope.$on('pQueryCompleted', function (event, data) {
        console.log("** pQueryCompleted is broadcasted");
        $scope.projects = DataService.globalprojects();
         $scope.$apply();
      });

      $scope.getUrl = function(project) {

       if(project != undefined &&  project.img != undefined ) {

         $cordovaFile.checkFile(cordova.file.dataDirectory, project.img ).then(function (success) {
            if(project.url !=  cordova.file.dataDirectory + project.img ) {

                   project.url = cordova.file.dataDirectory + project.img
                   DataService.updateProject(project,project.id)
            }
           }, function (error) {

           if(project.url != project.remote) {

                   console.log(error + " " + project.img  )
                   project.url = project.remote
                   DataService.updateProject(project,project.id)

             }
         });
        return project.url;
       }else{
        return 'img/image-placeholder.png';
       }
      };
      // Open our new task modal
      $scope.newProject = function() {
        console.log(">> newProject()");
          //alert("newProject");
        $scope.projectModal.show();
        console.log("<< newProject()");
      };

      // Close the new task modal
      $scope.closeNewProject = function() {
        console.log(">> closeNewProject()");
        $scope.projectModal.hide();
        console.log("<< closeNewProject()");
      };
      
   
       $scope.getMyFriends = function() {
             console.log(">> getMyFriends()");
             DataService.getMyFriends();
             DataService.getAllUsers();
             $scope.openFriendsModal();
             console.log("<< getMyFriends()"); 
       };
       
         
        $scope.addFriend = function(username) {
             DataService.addFriend(username)
              $scope.users.push(username)
             for(var i = 0; i< $scope.users.length; i++){
                 if($scope.users[i]==username){
                       $scope.users.pop()
                     break;
                 } 
             }
             
       
             for(var i = 0; i< $scope.others.length; i++){
                 if($scope.others[i]==username){
                     $scope.others.splice(i, 1);
                     break;
                 } 
             }
             
             $scope.$apply
       };
       
       
       $rootScope.$on('getFriends', function (event, data) {
          console.log("** getUsers is broadcasted");
          $scope.users = data;
        
        });
        
        
        $rootScope.$on('getUsers', function (event, data) {
          console.log("** getUsers is broadcasted");   
          $scope.others = data;
          $scope.$apply;
        });
      
      
      $scope.openFriendsModal = function(){
        console.log(">> openFriendsModal()");
        $scope.friendsModal.show();
        console.log("<< openFriendsModal()");
      }
      
      $scope.closeFriendsModal = function(){
        console.log(">> closeFriendsModal()");
        $scope.friendsModal.hide();
        console.log("<< closeFriendsModal()");
      }
      
       $ionicModal.fromTemplateUrl('templates/friends.html', function(modal) {
            $scope.friendsModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
       });

        $scope.showQuestions = function(projectId) {
            //alert(projectId);
            console.log(">> showQuestions() go(QuestionsHome)");
            callquestions =  DataService.questions(projectId);
            callimages = DataService.images(projectId);

            $state.go('QuestionsHome', {'projectId':projectId});
            console.log("<< showQuestions()");
        };
    
        $scope.openShareProjectModal = function(projectID){
            console.log(">> openShareProjectModal(" + projectID + ")");
            DataService.getMyFriends();
            $scope.projectID = projectID;
            $scope.shareProjectModal.show();
            console.log("<< openShareProjectModal()");
        }
        
         $scope.shareProject = function(){
            console.log(">> shareProject(" + $scope.projectID + ")");
            //if there is no selected user alert error
            DataService.shareProject($scope.projectID,$scope.selectedUsers)
            $scope.shareProjectModal.hide();
            $scope.selectedUsers = [];
            $scope.users = [];
            console.log("<< shareProject()");;
        }
        
        $scope.shareProjectCancel = function(){
            $scope.shareProjectModal.hide();
            $scope.selectedUsers = [];
            $scope.users = [];
        }
        
        $scope.addSelectedUser = function(user,selected){
            if(selected){
                $scope.selectedUsers.push(user)
            }else{
                for( var i = 0 ; i < $scope.selectedUsers.length ; i++ ){
                    if(user == $scope.selectedUsers[i]){
                        $scope.selectedUsers.splice(i,1);
                        break;
                    }
                }
            }
            
            console.log($scope.selectedUsers)
        }
        
        $ionicModal.fromTemplateUrl('templates/shareProject.html', function(modal) {
            $scope.shareProjectModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    
    })
