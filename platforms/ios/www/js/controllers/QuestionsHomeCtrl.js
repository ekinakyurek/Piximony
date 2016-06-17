angular.module('Piximony').controller('QuestionsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
        //alert($stateParams.projectId);
        $scope.projectID = $stateParams.projectId;
        $scope.users = []
        $scope.selectedUsers = []
        //$scope.projects = DataService.projects();
        $scope.projects = DataService.globalprojects();
        $scope.images = DataService.images($scope.projectID);
        $scope.questions = DataService.questions($scope.projectID);

        $rootScope.$on('pQueryCompleted', function (event, data) {
           console.log("** pQueryCompleted is broadcasted");
           $scope.projects = DataService.globalprojects();
		     //$scope.$apply();
         });

        //    for(var i = 0; i < $scope.projects.length; i += 1){
          //      if($scope.projects[i].id == $scope.projectID){
            //        $scope.projectName = $scope.projects[i].name;
              //DataService.storeProjects($scope.projects);
              //      break;
              //  }
            //}

        $rootScope.$on('qQueryCompleted', function (event, data) {
          console.log("** qQueryCompleted is broadcasted");
          $scope.questions = DataService.globalquestions();
	      $scope.$apply();
         });

        $rootScope.$on('iQueryCompleted', function (event, data) {
          console.log("** iQueryCompleted is broadcasted");
          $scope.images = DataService.globalimages();
	      //$scope.$apply();
        } );

        //$scope.questions = DataService.questions();

        // [
        //     {id: 1, projectId: 2, title: 'Question 1', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 2, projectId: 1, title: 'Question 2', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 3, projectId: 2, title: 'Question 3', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 4, projectId: 1, title: 'Question 4', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 5, projectId: 1, title: 'Question 5', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'}
        // ];

//        $ionicPlatform.ready(function() {
//        $scope.images = DataService.images();
//        $scope.questions = DataService.questions();
//
//        //$scope.$apply();
//        });

        $scope.addMedia = function() {
             console.log(">> addMedia()");
            $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take photo' },
                { text: 'Photo from library' }
            ],
            titleText: 'Add image',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                    $scope.addImage(index);
            }
            });
            console.log("<< addMedia()");
        }

        $scope.addImage = function(type) {
            console.log(">> addImage()");
            $scope.hideSheet();
            ImageService.handleMediaDialog(type,$scope.projectID,$scope.questions.length + 1).then(function() {
            $scope.questionImg = "img/image-placeholder.png";
            $scope.images = DataService.globalimages();
            //alert($scope.images[($scope.images.length)-1]);
            $scope.newQuestion($scope.images[($scope.images.length)-1]);
            //$scope.$apply();
            });
            console.log("<< addImage()");
        }
        
/*        $scope.openShareProjectModal = function(){
            console.log(">> openShareProjectModal()");
            DataService.getMyFriends();
            $scope.shareProjectModal.show();
            console.log("<< openShareProjectModal()");
        }
        
         $scope.shareProject = function(){
            console.log(">> shareProject()");
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
        }*/
        
        
        $rootScope.$on('getFriends', function (event, data) {
          console.log("** getFriends is broadcasted");
          $scope.users = [];
          $scope.selectedUsers = [];
          $scope.users = data;
          //$scope.shareModal.show();
        });

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('templates/new-question.html', function(modal) {
            $scope.questionModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        
        
         $ionicModal.fromTemplateUrl('templates/shareProject.html', function(modal) {
            $scope.shareProjectModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $ionicModal.fromTemplateUrl('templates/edit-question.html', function(modal) {
            $scope.updateQuestionModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.home = function() {
            console.log("HomeBtnClicked sent");
            $rootScope.$broadcast('HomeBtnClicked'); // $rootScope.$on && $scope.$on
            $state.go('MainPage');
        };

      $scope.getUrl = function(question) {

       if(question != undefined && question.img != undefined ) {

         $cordovaFile.checkFile(cordova.file.dataDirectory, question.name ).then(function (success) {
            if(question.url !=  cordova.file.dataDirectory + question.name ) {

                   question.url = cordova.file.dataDirectory + question.name
                   DataService.updateQuestion(question,$scope.projectID)
            }
           }, function (error) {

           if(question.url != question.remote) {

                   console.log(error + " " + question.img  )
                   question.url = question.remote
                   DataService.updateQuestion(question,$scope.projectID)

             }
         });
        return question.url;
       }else{
        return 'img/image-placeholder.png';
       }
      };
        // Called when the form is submitted
        $scope.createQuestion = function(questionTmp) {
            //alert('HELLO');
            //console.log("Selected Answer: " + questionTmp.answer);
            console.log(">> createQuestion()");
            var id = $scope.questions.length+1;
            var name =  $scope.questionImg.split("/")[$scope.questionImg.split("/").length-1]

            $scope.questions.push({
                id: id,
                projectId: $scope.projectID,
                title: questionTmp.title,
                options: [
                            questionTmp.options[0],
                            questionTmp.options[1],
                            questionTmp.options[2],
                            questionTmp.options[3]
                         ],
                answer: questionTmp.answer,
                img: $scope.questionImg,
                url: "img/image-placeholder.png",
                remote : "img/image-placeholder.png",
                name : name
            });



            //change projects thumbnail with last uploaded picture
            $scope.projects = DataService.globalprojects();
            for(var i = 0; i < $scope.projects.length; i += 1){
                if($scope.projects[i].id == $scope.projectID){
                    $scope.projects[i].img = $scope.questionImg.split("/")[$scope.questionImg.split("/").length-1];
                    DataService.updateProject($scope.projects[i],$scope.projects[i].id);
                    DataService.storeProjects($scope.projects);
                    break;
                }
            }
            $scope.questionModal.hide();
            DataService.storeQuestions($scope.questions,$scope.projectID);
            ImageService.uploadPictureToParse($scope.questionImg,name,$scope.projectID, id);
            questionTmp.title = "";
            questionTmp.options = "";
            questionTmp.answer = "";
             console.log("<< createQuestion()");
        };

        // Open our new question modal
        $scope.newQuestion = function(img) {
            console.log(">> newQuestion()" + img);

            $scope.questionImg = img ;
            $scope.options = [0,1,2,3];
            $scope.questionModal.show();


            console.log("<< newQuestion()");
        };

        // Close the new question modal
        $scope.closeNewQuestion = function() {
            console.log(">>closeNewQuestion():: deleteImage:: " + $scope.questionImg);
            ImageService.deleteMedia($scope.questionImg,$scope.projectID);
            $scope.questionModal.hide();
            console.log("<< closeNewQuestion()");
        };

        $scope.showQuestionDetails = function(questionID) {
            console.log(">> showQuestionDetails():: questionID:: "+ questionID );
            $scope.question = '';
            for(var i = 0; i < $scope.questions.length; i += 1){

                if(parseInt($scope.question.id) == parseInt(questionID)){
                    break;
                }

                    $scope.question = $scope.questions[i];
                    $scope.questionImg = $scope.questions[i].url;
            }
            $scope.updateQuestionModal.show();
            console.log("<< showQuestionDetails()");
        };

        $scope.updateMedia = function(questionID) {
            console.log(">> UpdateMedia():: questionID: " + questionID);
            $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take photo' },
                { text: 'Photo from library' }
            ],
            titleText: 'Update image',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                    $scope.updatePic(index,questionID);
            }
            });
            console.log("<< UpdateMedia()");
        };
        $scope.updatePic = function(type,questionID) {
            console.log(">> updatePic():: questionID: " + questionID);
            $scope.hideSheet();

            ImageService.handleMediaDialog(type,$scope.projectID,questionID).then(function() {

            $scope.images = DataService.globalimages();
            $scope.questionImg = $scope.images[($scope.images.length)-1];

            for(var i = 0; i < $scope.questions.length; i += 1){
                 if(parseInt($scope.questions[i].id) == parseInt(questionID)){
                     break;
                 }
           }
            console.log("** updatePic():: Pic Index: " + i);
            console.log("** updatePic():: Pic Path: " + $scope.questions[i].img);

            $scope.questions[i].img =  $scope.questionImg;
            $scope.questions[i].name = $scope.questionImg.split("/")[$scope.questionImg.split("/").length-1];
            console.log('name: ' +   $scope.questions[i].name );

            $scope.questions[i].url =  $scope.questionImg;
            $scope.$apply();
            DataService.storeQuestions($scope.questions,$scope.projectID);

            ImageService.uploadPictureToParse($scope.questionImg,$scope.questions[i].name,$scope.projectID,questionID);

            $scope.projects = DataService.globalprojects();
            console.log("** updatePic():: projects : " + $scope.projects);

            for( i = 0; i < $scope.projects.length; i += 1){
                if($scope.projects[i].id == $scope.projectID){
                    console.log("** updatePic():: Current projectID : " + $scope.projectID);
                    console.log("** updatePic():: index of the current project : " + i);
                    console.log("** updatePic():: Current project Img : " + $scope.questionImg);
                    $scope.projects[i].img = $scope.questionImg.split("/")[$scope.questionImg.split("/").length-1];
                    $scope.projects[i].url = $scope.questionImg;
				    DataService.updateProject($scope.projects[i],$scope.projects[i].id);
                    DataService.storeProjects($scope.projects);
                    break;
                }
            }

            //$scope.$apply();
            });
            console.log("<< updatePic()");
        };

        // Close the new task modal
        $scope.closeUpdateQuestion = function() {
            console.log(">> closeUpdateQuestion()");
            $scope.updateQuestionModal.hide();
            console.log("<< closeUpdateQuestion()");
        };
        $scope.updateQuestion = function(question) {
            console.log(">> updateQuestion():: quesstionID::" + question.id);
            for(var i = 0; i < $scope.questions.length; i += 1){
                if(parseInt($scope.questions[i].id) == parseInt(question.id)){
					          $scope.questions[i] = question;
                    break;
                }
            }
            DataService.storeQuestions($scope.questions,$scope.projectID);
            $scope.updateQuestionModal.hide();
            console.log("<< updateQuestion()");
        };
    });
