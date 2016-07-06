angular.module('Piximony').controller('ProjectsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService, WebService)  {

    $scope.$projects = DataService.getProjects()
    $rootScope.$on('userProjects', function (event, data) {
        console.log('>> userProjects.$on() userProjects event recieved');
        //$scope.projectsToPlay = DataService.projects2Play();
        if(data.length > 0){
            $scope.projects = data
            DataService.storeProjects(data)
        }
    });

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

        var id = WebService.randomString(64)

        console.log(">> ProjectsHomeCtrl.createProject() with id: " + id)

        var project =  {
            project_id: id,
            title: project.name,
            thumbnail_url: 'img/image-placeholder.png',
            picture_url: 'img/image-placeholder.png',
            questions: []
        }


        if(project.title.length > 20){
            alert("Project name is too long: " + project.title);
        }else{
            $scope.projects.unshift(project);
            $scope.projectModal.hide();
            DataService.storeProject(project)
            WebService.create_project(project,function(result,response){
                if (result == true){
                    console.log(JSON.stringify(response))
                }else{
                    alert("There was an error, when creating project")
                }
            })

        }
      };

      $rootScope.$on('HomeBtnClicked', function (event, data) {
        console.log('** ProjectsHomeCtrl.$on() HomeBtnClicked recieved');
      });

      $scope.getUrl = function(project) {

       if(project != undefined &&  project.img != undefined ) {

         $cordovaFile.checkFile(cordova.file.dataDirectory, project.img ).then(function (success) {
            if(project.url !=  cordova.file.dataDirectory + project.img ) {
                project.url = cordova.file.dataDirectory + project.img
                  
            }
           }, function (error) {

           if(project.url != project.remote) {
                console.log("** ProjectsHomeCtrl.$on() error: " + error + " " + project.img)
                project.url = project.remote
                
             }
         });
        return project.url;
       }else{
        return 'img/image-placeholder.png';
       }
      };
      // Open our new task modal
      $scope.newProject = function() {
        console.log(">> ProjectsHomeCtrl.newProject()");
          //alert("newProject");
        $scope.projectModal.show();
        console.log("<< ProjectsHomeCtrl.newProject()");
      };

      // Close the new task modal
      $scope.closeNewProject = function() {
        console.log(">> ProjectsHomeCtrl.closeNewProject()");
        $scope.projectModal.hide();
        console.log("<< ProjectsHomeCtrl.closeNewProject()");
      };
      
   
       $scope.getMyFriends = function() {
             console.log(">> ProjectsHomeCtrl.getMyFriends()");
           //   WebService.get_friends(function (result,response) {
           //       if (result==true){
           //           console.log(JSON.stringify(response))
           //           $scope.friends = response
           //       }else{
           //           console.log(JSON.stringify(response))
           //       }
           //   })
           //
           // WebService.get_requests(function (result,response) {
           //     if (result==true){
           //         console.log(JSON.stringify(response))
           //         $scope.requests = response
           //     }else{
           //         console.log(JSON.stringify(response))
           //     }
           // })


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

           $scope.openFriendsModal();
             console.log("<< ProjectsHomeCtrl.getMyFriends()"); 
       };

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
       
       // $rootScope.$on('getFriends', function (event, data) {
       //    console.log("** ProjectsHomeCtrl.$on() getFriends is broadcasted");
       //    $scope.users = data;
       // 
       //  });
       // 
       // 
       //  $rootScope.$on('getUsers', function (event, data) {
       //    console.log("** ProjectsHomeCtrl.$on() getUsers is broadcasted");   
       //    $scope.others = data;
       //    $scope.$apply;
       //  });
      
      
      $scope.openFriendsModal = function(){
        console.log(">> ProjectsHomeCtrl.openFriendsModal()");
        $scope.friendsModal.show();
        console.log("<< ProjectsHomeCtrl.openFriendsModal()");
      }
      
      $scope.closeFriendsModal = function(){
        console.log(">> ProjectsHomeCtrl.closeFriendsModal()");
        $scope.friendsModal.hide();
        console.log("<< ProjectsHomeCtrl.closeFriendsModal()");
      }
      
       $ionicModal.fromTemplateUrl('templates/friends.html', function(modal) {
            $scope.friendsModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
       });

        $scope.showQuestions = function(projectId) {
            //alert(projectId);
            console.log(">> ProjectsHomeCtrl.showQuestions(" + projectId + ")");
            WebService.get_questions(projectId, function (result, questions) {
                if (result==true) {
                    $rootScope.$broadcast('projectQuestions',questions);
                    console.log(questions)
                }else{
                    alert("There was an error in show questions")
                }
            })


            $state.go('QuestionsHome', {'projectId':projectId});
            console.log("<< ProjectsHomeCtrl.showQuestions()");
        };
    
        $scope.openShareProjectModal = function(projectID){
            console.log(">> ProjectsHomeCtrl.openShareProjectModal(" + projectID + ")");
            $scope.projectID = projectID;
            $scope.shareProjectModal.show();
            console.log("<< ProjectsHomeCtrl.openShareProjectModal()");
        };
        
         $scope.shareProject = function(){
            console.log(">> ProjectsHomeCtrl.shareProject(" + $scope.projectID + ")");
            //if there is no selected user alert error
            $scope.shareProjectModal.hide();
            $scope.selectedUsers = [];
            $scope.users = [];
            console.log("<< ProjectsHomeCtrl.shareProject()");
        };
        
        $scope.shareProjectCancel = function(){
            console.log(">> ProjectsHomeCtrl.shareProjectCancel()");
            $scope.shareProjectModal.hide();
            $scope.selectedUsers = [];
            $scope.users = [];
            console.log("<< ProjectsHomeCtrl.shareProjectCancel()");
        };
        
        $scope.addSelectedUser = function(user,selected){
            console.log(">> ProjectsHomeCtrl.addSelectedUser(" + user + selected + ")");
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
            console.log("<< ProjectsHomeCtrl.addSelectedUser(" + $scope.selectedUsers + ")");
        };
        
        $ionicModal.fromTemplateUrl('templates/shareProject.html', function(modal) {
            $scope.shareProjectModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
});
