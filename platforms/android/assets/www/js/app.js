// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Piximony', ['ionic','ngCordova'])
    .config(function($stateProvider, $urlRouterProvider) {

        Parse.initialize("Cf8RgFxwJbxS93aUxTNYtJbzcxRpkywAwNu4aoNb", "qWAIcupqoM1QV8kbW0MblWUOZzasYBBgLrrLzA32");
        
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
          console.log('** optionSelected:: selectedIndex:',selectedIndex);
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
          //alert($scope.projects.length);
        var id = $scope.projects.length+1;
        
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
        project.name = "";
        }
      };
      
      $rootScope.$on('HomeBtnClicked', function (event, data) {
        console.log('HomeBtnClicked recieved');
        $scope.projects = DataService.projects();
      });


      // Open our new task modal
      $scope.newProject = function() {
          //alert("newProject");
        $scope.projectModal.show();
      };

      // Close the new task modal
      $scope.closeNewProject = function() {
        $scope.projectModal.hide();
      };

        $scope.showQuestions = function(projectId) {
            //alert(projectId);
            $state.go('QuestionsHome', {'projectId':projectId});
        };
    })

    .controller('QuestionsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
        //alert($stateParams.projectId);
        $scope.projectID = $stateParams.projectId;
    
        $scope.projects = DataService.projects();
            for(var i = 0; i < $scope.projects.length; i += 1){
                if($scope.projects[i].id == $scope.projectID){
                    $scope.projectName = $scope.projects[i].name;
                    DataService.storeProjects($scope.projects);
                    break;
                }
            }
    
        //$scope.questions = DataService.questions();

        // [
        //     {id: 1, projectId: 2, title: 'Question 1', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 2, projectId: 1, title: 'Question 2', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 3, projectId: 2, title: 'Question 3', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 4, projectId: 1, title: 'Question 4', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
        //     {id: 5, projectId: 1, title: 'Question 5', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'}
        // ];

        $ionicPlatform.ready(function() {
        $scope.images = DataService.images();
        $scope.questions = DataService.questions();

        //$scope.$apply();
        });

        $scope.addMedia = function() {
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
        }

        $scope.addImage = function(type) {
            $scope.hideSheet();
            ImageService.handleMediaDialog(type).then(function() {
            $scope.questionImg = "img/image-placeholder.png";
            $scope.images = DataService.images();
            //alert($scope.images[($scope.images.length)-1]);
            $scope.newQuestion($scope.images[($scope.images.length)-1]);
            //$scope.$apply();
            });
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

        // Called when the form is submitted
        $scope.createQuestion = function(questionTmp) {
            //alert('HELLO');
            //console.log("Selected Answer: " + questionTmp.answer);
            
            var id = $scope.questions.length+1;
            $scope.questions.push({
                id: id,
                projectId: $scope.projectID,
                title: questionTmp.title,
                options: {  
                            A: questionTmp.options[0],
                            B: questionTmp.options[1],
                            C: questionTmp.options[2],
                            D: questionTmp.options[3]
                    },
                answer: questionTmp.answer,
                img: $scope.questionImg
            });

            $scope.projects = DataService.projects();
            for(var i = 0; i < $scope.projects.length; i += 1){
                if($scope.projects[i].id == $scope.projectID){
                    $scope.projects[i].img = $scope.questionImg;
                    DataService.storeProjects($scope.projects);
                    break;
                }
            }
            $scope.questionModal.hide();
            DataService.storeQuestions($scope.questions);
            questionTmp.title = "";
            questionTmp.options = "";
            questionTmp.answer = "";
        };

        // Open our new question modal
        $scope.newQuestion = function(img) {
            $scope.questionImg = cordova.file.dataDirectory + img;
            $scope.options = [0,1,2,3];
            $scope.questionModal.show();
        };

        // Close the new question modal
        $scope.closeNewQuestion = function() {
            ImageService.deleteMedia($scope.questionImg);
            $scope.questionModal.hide();
        };

        $scope.showQuestionDetails = function(questionID) {
            $scope.question = '';
            for(var i = 0; i < $scope.questions.length; i += 1){
                $scope.question = $scope.questions[i];
                if($scope.question.id == questionID){
                    break;
                }
            }
            //alert($scope.question.id);
            $scope.updateQuestionModal.show();
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
        };
        $scope.updatePic = function(type,questionID) {
            console.log(">> updatePic():: questionID: " + questionID);
            $scope.hideSheet();
            ImageService.handleMediaDialog(type).then(function() {
            $scope.images = DataService.images();
            
            
            for(var i = 0; i < $scope.questions.length; i += 1){
                if($scope.questions[i] == questionID){
                    break;
                }
            }
            console.log("** updatePic():: Pic Index: " + (i-1));
            console.log("** updatePic():: Pic Path: " + $scope.questions[i-1].img);
            
            ImageService.deleteMedia($scope.questions[i-1].img);
            $scope.images = DataService.images();
            console.log("** updatePic():: images after removal: " + $scope.images);
            $scope.questionImg = cordova.file.dataDirectory + $scope.images[($scope.images.length)-1];
                 
            $scope.questions[i-1].img = cordova.file.dataDirectory + $scope.images[($scope.images.length)-1];
            DataService.storeQuestions($scope.questions);
                
            $scope.projects = DataService.projects();
            console.log("** updatePic():: projects : " + $scope.projects);    
            for(var i = 0; i < $scope.projects.length; i += 1){
                if($scope.projects[i].id == $scope.projectID){
                    console.log("** updatePic():: Current projectID : " + $scope.projectID);
                    console.log("** updatePic():: index of the current project : " + i);
                    console.log("** updatePic():: Current project Img : " + $scope.questionImg);
                    $scope.projects[i].img = $scope.questionImg;
                    DataService.storeProjects($scope.projects);
                    break;
                }
            }
                                            
            //$scope.$apply();
            });
        };
    
        // Close the new task modal
        $scope.closeUpdateQuestion = function() {
            $scope.updateQuestionModal.hide();
        };
        $scope.updateQuestion = function(question) {
            
            for(var i = 0; i < $scope.questions.length; i += 1){
                if($scope.questions[i] == question.id){
                    break;
                }
            }
            $scope.questions[i-1] = question;
            DataService.storeQuestions($scope.questions);
            //$scope.$apply();
            
            $scope.updateQuestionModal.hide();
        };
    });