// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova'])
    .config(function($stateProvider, $urlRouterProvider) {

        //Parse.initialize("Cf8RgFxwJbxS93aUxTNYtJbzcxRpkywAwNu4aoNb", "qWAIcupqoM1QV8kbW0MblWUOZzasYBBgLrrLzA32");
        Parse.initialize("iZdpAD7vYS44lPB2qLDedAsl8Fn5XUwtNkHJjYN4", "9OCTXn0Y0kMlRfpPtpeKGGgIevY7waMMUuwrHmpU");
            $stateProvider
            .state('MainPage', {
                url: '/MainPage',
                templateUrl: 'templates/MainPage.html',
                controller: 'MainPageCtrl'
            })
            .state('PlayerHome', {
                url: '/PlayerHome',
                templateUrl: 'templates/PlayerHome.html',
                controller: 'PlayerHomeCtrl'
            })
            .state('ProjectsHome', {
                url: '/ProjectsHome',
                templateUrl: 'templates/ProjectsHome.html',
                controller: 'ProjectsHomeCtrl'
            })
            .state('QuestionsHome', {
                url: '/QuestionsHome',
                templateUrl: 'templates/QuestionsHome.html',
                controller: 'QuestionsHomeCtrl',
                params: {'projectId': null}
            })
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'SignInCtrl'
            });

            
        $urlRouterProvider.otherwise('/sign-in');

    })

    .controller('MainPageCtrl', function($scope, $state) {
        $scope.GoToProjectsHome = function() {
            console.log("** GoToProjectsHome()");
            $state.go('ProjectsHome');
        };
        $scope.GoToPlayerHome = function() {
            console.log("** GoToPlayerHome()");
            $state.go('PlayerHome');
        };


    })

    .controller('SignInCtrl', function($scope, $state) {
        
        $scope.signIn = function(user) {
            console.log(">> signIn");
            Parse.User.logIn(user.username, user.password, {
                success: function(PFuser) {
                  $state.go('MainPage');
                  $scope.user=PFuser;
                },
                error: function(PFuser, error) {
                   alert("Error: " + error.code + " " + error.message);
                }
            });
        };
        
        $scope.isVisible = false;
        $scope.buttonText= "Sign Up" // After click, returns to <complete registration>
        
        $scope.signUP = function(user) {
            if(!$scope.isVisible){
                 $scope.isVisible = !$scope.isVisible;
                 buttonText = "Complete Registration"
            }else{
                console.log(">>signUP: Register");
                
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
        };
       
        $scope.toggle = function() {
            $scope.isVisible = !$scope.isVisible;   
        };
               
                

    })

    .controller('PlayerHomeCtrl', function($scope, $rootScope, $timeout, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
      //   $scope.projects = [
      //     {id: 1, name: 'Volkan\'s project 1', img: 'img/image-placeholder.png'},
      //     {id: 2, name: 'Martin\'s project 2', img: 'img/image-placeholder.png'},
      //     {id: 3, name: 'Atlas\'s project 3', img: 'img/image-placeholder.png'}
      // ];
    
      $scope.projectsToPlay = DataService.projectsToPlay();
      $scope.questionsToPlay = DataService.questionsToPlay();
      
      $scope.currentQuestion = 0;
    
      $scope.questionTmp = $scope.questionsToPlay[$scope.currentQuestion];
      $scope.optionsTmp = $scope.questionsToPlay[$scope.currentQuestion].options;
    
      $scope.questionImg = $scope.questionsToPlay[$scope.currentQuestion].img;

    $scope.trial = [false,false,false,false];
    $scope.bingo = false;
    
    window.addEventListener("orientationchange", function(){
        console.log('Orientation changed to ' + screen.orientation);
    });
    
      // Create and load the Modal
    //====>
      $ionicModal.fromTemplateUrl('templates/player.html', function(modal) {
        $scope.playerModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      $scope.home = function() {
          $state.go('MainPage');
      };

    $scope.nextQuestion = function(){
        $scope.closefullScreenModal();
        $scope.trial = [false,false,false,false];
        $scope.bingo = false;
        
        if($scope.currentQuestion < $scope.questionsToPlay.length)
            $scope.currentQuestion++;
        //else
        //    $scope.currentQuestion = 0;
        $scope.questionTmp = $scope.questionsToPlay[$scope.currentQuestion];
        $scope.optionsTmp = $scope.questionsToPlay[$scope.currentQuestion].options;
        $scope.questionImg = $scope.questionsToPlay[$scope.currentQuestion].img; 
        
    };
    
      $scope.optionSelected = function(option) {
          console.log('>> optionSelected : (' + option + ')');
          //alert(option);
          //alert($scope.questionsToPlay[1].answer);
          selectedIndex = $scope.optionsTmp.indexOf(option);
          
          //alert(selectedIndex);
          console.log('** optionSelected:: selectedIndex:('+selectedIndex+')');
          //alert($scope.questionsToPlay[1].answer.charCodeAt(0));
          //alert('A'.charCodeAt(0));
          
          if($scope.questionsToPlay[$scope.currentQuestion].answer == selectedIndex)
            {
                console.log('** optionSelected:: BINGO');
                $scope.bingo = true;
                $scope.fullScreen($scope.questionImg);
                $timeout($scope.nextQuestion,3000);
            }
          else
            {
                console.log('** optionSelected:: SORRY');                
                $scope.trial[selectedIndex] = true;
            }
          console.log('<< optionSelected::');
      };
    
        $scope.isThisDisabled = function(option) {
            console.log('>> isThisDisabled:: for: (' + option + ')');
            Index = $scope.optionsTmp.indexOf(option);
            console.log('** isThisDisabled::Index:' + Index);
            if(($scope.trial[Index] == true | $scope.bingo == true) & !($scope.questionsToPlay[$scope.currentQuestion].answer == Index))
            {               
               console.log('<< isThisDisabled:: TRUE for: (' + option + ')');
               return true;
            }
            else
            {
                console.log('<< isThisDisabled:: FALSE for: (' + option + ')');
               return false;
            }
            
      };
        $scope.isThisChecked = function(option) {
            console.log('>> isThisChecked:: for: (' + option + ')');
            
            Index = $scope.optionsTmp.indexOf(option);
            console.log('** isThisChecked::Index:' + Index);
            if($scope.trial[Index] == true & !($scope.questionsToPlay[$scope.currentQuestion].answer))
            {
               console.log('<< isThisChecked:: false for: (' + option + ')');
               return false;
            }
            else
                console.log('<< isThisChecked:: not changed for: (' + option + ')');

      };

    
    $ionicModal.fromTemplateUrl('templates/image-modal.html', function(modal) {
        $scope.fullScreenModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

    
    $scope.openfullScreenModal = function() {
      console.log('** openfullScreenModal::Modal is shown!');
      $scope.fullScreenModal.show();
    };

    $scope.closefullScreenModal = function() {
      console.log('**closefullScreenModal::Modal is closed!');
      $scope.fullScreenModal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      console.log('**$on.$destroy::Modal is destroyed!');
      $scope.fullScreenModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('fullScreenModal.hide', function() {
        console.log('**$on.fullScreenModal.hide::Modal is hide!');
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('fullScreenModal.removed', function() {
        console.log('**$on.fullScreenModal.removed::Modal is removed!');
      // Execute action
    });
    $scope.$on('fullScreenModal.shown', function() {
        console.log('**$on.fullScreenModal.shown::Modal is shown!');
      console.log('Modal is shown!');
    });

    
    $scope.fullScreen = function(img){
        
        $scope.imageSrc = img;
        $scope.openfullScreenModal();
    };
    
      $rootScope.$on('HomeBtnClicked', function (event, data) {
        console.log('HomeBtnClicked recieved');
        $scope.projects = DataService.projects();
      });


      $scope.openPlayer = function() {
        $scope.playerModal.show();
      };
    
      $scope.closePlayer = function() {
        $scope.playerModal.hide();
      };

    })

    .controller('ProjectsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
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
            img: 'img/image-placeholder.png'
        });

        if(project.name.length > 20){
            alert("Too long project name : " + project.name);
        }
        else{
        $scope.projectModal.hide();
        DataService.storeProjects($scope.projects);
        DataService.pushProject({ id: id, name: project.name, img: 'img/image-placeholder.png' });
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

        $scope.showQuestions = function(projectId) {
            //alert(projectId);
            console.log(">> showQuestions() go(QuestionsHome)");
            $state.go('QuestionsHome', {'projectId':projectId});
            console.log("<< showQuestions()");
        };
    })

    .controller('QuestionsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
        //alert($stateParams.projectId);
        $scope.projectID = $stateParams.projectId;
    
        //$scope.projects = DataService.projects();
        $scope.projects = DataService.globalprojects();
        $scope.images = DataService.images($scope.projectID);
        $scope.questions = DataService.questions($scope.projectID);
    
        $rootScope.$on('pQueryCompleted', function (event, data) {
           console.log("** pQueryCompleted is broadcasted");
           $scope.projects = DataService.globalprojects();
		     //$scope.$apply();
         });
    
//            for(var i = 0; i < $scope.projects.length; i += 1){
//                if($scope.projects[i].id == $scope.projectID){
//                    $scope.projectName = $scope.projects[i].name;
//                    DataService.storeProjects($scope.projects);
//                    break;
//                }
//            }
    
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

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('templates/new-question.html', function(modal) {
            $scope.questionModal = modal;
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
                    $scope.projects[i].img = $scope.questionImg;
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
                    $scope.projects[i].img = $scope.questionImg;
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