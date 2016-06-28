angular.module('Piximony').controller('QuestionsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService, WebService)  {
        //alert($stateParams.projectId);
        $scope.projectID = $stateParams.projectId;
       
        $scope.users = []
        $scope.selectedUsers = []
        //$scope.projects = DataService.projects();
    
        $rootScope.$on('projectQuestions', function (event, data) {
          console.log("** QuestionsHomeCtrl.$on() projectQuestions is broadcasted");
          $scope.questions = data
          console.log(JSON.stringify(data))
         });

        $scope.openShareModal = function(){
            console.log("share modal clicked")
            $scope.shareModal.show()
            WebService.get_friends(function(result,users){
                
                if(result){
                    $scope.friends = users
                }
            })
    
        }
    
        $scope.share = function(){
            console.log("sharing started")
            //if there is no selected user alert error
            //DataService.shareProject($scope.projectID,$scope.selectedUsers)
            WebService.share_project($scope.projectID, $scope.selectedUsers, function (result,response) {
                if(!result){
                    alert("There was an error when sharing the project")
                    console.log(response)
                }else{
                    
                }
            })
            $scope.shareModal.hide()
            $scope.selectedUsers = [];
            $scope.friends = [];
        }
    
        $scope.sharecancel = function(){
            $scope.shareModal.hide()
            $scope.selectedUsers = [];
            $scope.friends = [];
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
       
        $scope.addMedia = function() {
             console.log(">> QuestionsHomeCtrl.addMedia()");
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
            console.log("<< QuestionsHomeCtrl.addMedia()");
        }

        $scope.addImage = function(type) {
            console.log(">> QuestionsHomeCtrl.addImage()");
            $scope.hideSheet();
            ImageService.handleMediaDialog(type,$scope.projectID,$scope.questions.length + 1).then(function() {
            $scope.questionImg = "img/image-placeholder.png";
            $scope.images = DataService.globalimages();
            //alert($scope.images[($scope.images.length)-1]);
            $scope.newQuestion($scope.images[($scope.images.length)-1]);
            //$scope.$apply();
            });
            console.log("<< QuestionsHomeCtrl.addImage()");
        }
        


        // Create and load the Modal
        $ionicModal.fromTemplateUrl('templates/new-question.html', function(modal) {
            $scope.questionModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        
        
         $ionicModal.fromTemplateUrl('templates/shareProject.html', function(modal) {
            $scope.shareModal = modal;
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
            console.log("** QuestionsHomeCtrl.home() HomeBtnClicked sent");
            $rootScope.$broadcast('HomeBtnClicked'); // $rootScope.$on && $scope.$on
            $state.go('MainPage');
        };

      $scope.getUrl = function(question) {
          console.log(">> QuestionsHomeCtrl.getUrl(" + question + ")");
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
        console.log("<< QuestionsHomeCtrl.getUrl(" + question.url + ")");
        return question.url;
       }else{
        console.log("<< QuestionsHomeCtrl.getUrl(default)");
        return 'img/image-placeholder.png';
       }
      };
        // Called when the form is submitted
        $scope.createQuestion = function(questionTmp) {
            //alert('HELLO');
            console.log(">> QuestionsHomeCtrl.createQuestion(" + questionTmp + ")");
            var id = WebService.randomString(64)
            var name =  $scope.questionImg.split("/")[$scope.questionImg.split("/").length-1]

            question = {
                question_id: id,
                project_id: $scope.projectID,
                title: questionTmp.title,
                options: [
                    questionTmp.options[0],
                    questionTmp.options[1],
                    questionTmp.options[2],
                    questionTmp.options[3]
                ],
                correct_option: questionTmp.answer,
                picture_url: $scope.questionImg,
                thumbnail_url: "img/image-placeholder.png",
                remote : "img/image-placeholder.png",
                name: name
            }

            $scope.questions.unshift(question);

            WebService.create_question(question,function(result,response){
                if (result == true){

                }else{
                    alert("There was an error when creating question")
                }
            })


            $scope.questionModal.hide();

             console.log("<< QuestionsHomeCtrl.createQuestion()");
        };

        // Open our new question modal
        $scope.newQuestion = function(img) {
            console.log(">> QuestionsHomeCtrl.newQuestion(" + img + ")");
            $scope.questionImg = img ;
            $scope.options = [0,1,2,3];
            $scope.questionModal.show();
            console.log("<< QuestionsHomeCtrl.newQuestion()");
        };

        // Close the new question modal
        $scope.closeNewQuestion = function() {
            console.log(">> QuestionsHomeCtrl.closeNewQuestion() deleteImage:" + $scope.questionImg);
            ImageService.deleteMedia($scope.questionImg,$scope.projectID);
            $scope.questionModal.hide();
            console.log("<< QuestionsHomeCtrl.closeNewQuestion()");
        };

        $scope.showQuestionDetails = function(questionID) {
            console.log(">> QuestionsHomeCtrl.showQuestionDetails() questionID:"+ questionID );
            $scope.question = '';
            for(var i = 0; i < $scope.questions.length; i += 1) {

                if ($scope.questions[i].question_id == questionID) {
                    $scope.question = $scope.questions[i];
                    if ($scope.question.name != undefined) {
                        $scope.questionImg = cordova.file.dataDirectory + $scope.question.name
                    } else {
                        $scope.questionImg = $scope.question.picture_url
                    }
                    break;
                }
            }

            console.log(JSON.stringify($scope.question))
            $scope.updateQuestionModal.show();
            console.log("<< QuestionsHomeCtrl.showQuestionDetails()");
        };

        $scope.updateMedia = function(questionID) {
            console.log(">> QuestionsHomeCtrl.UpdateMedia() questionID:" + questionID);
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
            console.log("<< QuestionsHomeCtrl.UpdateMedia()");
        };

        $scope.updatePic = function(type,questionID) {
            console.log(">> QuestionsHomeCtrl.updatePic() questionID:" + questionID);
            $scope.hideSheet();
            ImageService.handleMediaDialog(type,$scope.projectID,questionID).then(function(name) {

                $scope.question.picture_url =  cordova.file.dataDirectory + name
                $scope.question.img =  $scope.question.picture_url
                $scope.question.name = name
                $scope.question.url =  $scope.question.picture_url
                $scope.questionImg =   $scope.question.picture_url

                for(var i = 0; i < $scope.questions.length; i += 1){
                    if($scope.questions[i].question_id == questionID){
                        $scope.questions[i] = $scope.question;
                        break;
                    }
                }

                console.log("** QuestionsHomeCtrl.updatePic() Pic Index: " + i);
                console.log("** QuestionsHomeCtrl.updatePic() Pic Path:" + $scope.questions[i].img);
                console.log('** QuestionsHomeCtrl.updatePic() name:' + $scope.questions[i].name);

                $scope.$apply()

            });
            console.log("<< QuestionsHomeCtrl.updatePic()");
        };

        // Close the new task modal
        $scope.closeUpdateQuestion = function() {
            console.log(">> QuestionsHomeCtrl.closeUpdateQuestion()");
            $scope.updateQuestionModal.hide();
            console.log("<< QuestionsHomeCtrl.closeUpdateQuestion()");
        };
        $scope.updateQuestion = function(question) {
            console.log(">> QuestionsHomeCtrl.updateQuestion() quesstionID:" + question.question_id);
            for(var i = 0; i < $scope.questions.length; i += 1) {
                if (parseInt($scope.questions[i].question_id) == parseInt(question.question_id)) {
                    $scope.questions[i] = question;
                    break;
                }
            }
            WebService.update_question(question,question.name,function(result,response){
                if (result==true){
                    console.log(JSON.stringify(response))
                }else{
                    alert("error:" + JSON.stringify(response))
                }
            })
            //DataService.storeQuestions($scope.questions,$scope.projectID);
            $scope.updateQuestionModal.hide();
            console.log("<< QuestionsHomeCtrl.updateQuestion()");
        };
    });
