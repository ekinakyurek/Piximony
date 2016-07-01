angular.module('Piximony').controller('PlayerHomeCtrl', function($scope, $rootScope, $timeout, $state, $stateParams, $ionicModal, $cordovaDevice,  $ionicPlatform, $ionicActionSheet, DataService, WebService)  {

  $scope.projectindex = 0
  $rootScope.$on('projectsToPlay', function (event, data) {
    console.log('>> PlayerHomeCtrl.$on() projectsToPlay event recieved');
    //$scope.projectsToPlay = DataService.projects2Play();
      $scope.projectsToPlay = data
      $scope.currentQuestion = 0;
      $scope.currentScore = 0;
      $scope.trial = [false,false,false,false];
      $scope.bingo = false;
      console.log("** PlayerHomeCtrl.$on() " + $scope.projectsToPlay);
      console.log('<< PlayerHomeCtrl.$on() projectsToPlay');
  });



    window.addEventListener("orientationchange", function(){
        console.log('** PlayerHomeCtrl.Orientation changed to ' + screen.orientation);
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
        console.log('>> PlayerHomeCtrl.nextQuestion()');
        $scope.closefullScreenModal();
        $scope.trial = [false,false,false,false];
        $scope.bingo = false;

        console.log('** PlayerHomeCtrl.nextQuestion() $scope.currentQuestion:',$scope.currentQuestion);
        console.log('** PlayerHomeCtrl.nextQuestion() $scope.questionsToPlay.length:',$scope.projectsToPlay[$scope.projectindex].questions.length);
        if($scope.currentQuestion < $scope.projectsToPlay[$scope.projectindex].questions.length-1)
            $scope.currentQuestion++;
        else
        {
            $scope.currentQuestion = 0;
            $scope.currentScore = 0;
            //$scope.closePlayer();
            $scope.removePlayer();
        }
        $scope.questionTmp = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion];
        $scope.optionsTmp = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].options;
        $scope.questionImg = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].picture_url;
        console.log('<< PlayerHomeCtrl.nextQuestion()');
    };

      $scope.optionSelected = function(option) {
          console.log('>> PlayerHomeCtrl.optionSelected() : (' + option + ')');
          //alert(option);
          //alert($scope.questionsToPlay[1].answer);
          var selectedIndex = $scope.optionsTmp.indexOf(option);

          //alert(selectedIndex);
          console.log('** PlayerHomeCtrl.optionSelected() selectedIndex:('+selectedIndex+')');
          //alert($scope.questionsToPlay[1].answer.charCodeAt(0));
          //alert('A'.charCodeAt(0));

          if($scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].correct_option == selectedIndex)
            {
                console.log('** PlayerHomeCtrl.optionSelected() BINGO');
                $scope.bingo = true;
                for(var i=0; i<$scope.trial.length; i++){
                    if($scope.trial[i] == false)
                        $scope.currentScore = $scope.currentScore+25;
                }
                
                $scope.fullScreen($scope.questionImg);
                $timeout($scope.nextQuestion,3000);
                
            }
          else
            {
                console.log('** PlayerHomeCtrl.optionSelected() SORRY');
                $scope.trial[selectedIndex] = true;
            }
          console.log('<< PlayerHomeCtrl.optionSelected()');
      };

        $scope.isThisDisabled = function(option) {
            console.log('>> PlayerHomeCtrl.isThisDisabled() for: (' + option + ')');
            var Index = $scope.optionsTmp.indexOf(option);
            console.log('** PlayerHomeCtrl.isThisDisabled() Index:' + Index);
            console.log('** PlayerHomeCtrl.isThisDisabled() trial[' + Index + "]:" + $scope.trial[Index]);
            console.log('** PlayerHomeCtrl.isThisDisabled() answer:' +$scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].correct_option );
            
            if(($scope.trial[Index] == true ) & !($scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].correct_option == Index))
            {
               console.log('<< PlayerHomeCtrl.isThisDisabled() TRUE for: (' + option + ')');
               return true;
            }
            else
            {
                console.log('<< PlayerHomeCtrl.isThisDisabled() FALSE for: (' + option + ')');
               //return false;
            }

      };
        $scope.isThisChecked = function(option) {
            console.log('>> PlayerHomeCtrl.isThisChecked() for: (' + option + ')');

            var Index = $scope.optionsTmp.indexOf(option);
            
            console.log('** PlayerHomeCtrl.isThisChecked() Index:' + Index);
            console.log('** PlayerHomeCtrl.isThisChecked() trial[' + Index + "]:" + $scope.trial[Index]);
            console.log('** PlayerHomeCtrl.isThisChecked() answer:' +$scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].correct_option);
            if($scope.trial[Index] == true & !($scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].correct_option == Index))
            {
               console.log('<< PlayerHomeCtrl.isThisChecked() false for: (' + option + ')');
               return false;
            }
            else if ($scope.bingo == true)
            {
                console.log('<< PlayerHomeCtrl.isThisChecked() false (BINGO) for: (' + option + ')');
                return false;
            }
            else{
              console.log('<< PlayerHomeCtrl.isThisChecked() not changed for: (' + option + ')');
              //return false;
            }
             
      };


    $ionicModal.fromTemplateUrl('templates/image-modal.html', function(modal) {
        $scope.fullScreenModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });


    $scope.openfullScreenModal = function() {
      console.log('** PlayerHomeCtrl.openfullScreenModal() Modal is shown!');
      $scope.fullScreenModal.show();
    };

    $scope.closefullScreenModal = function() {
      console.log('** PlayerHomeCtrl.closefullScreenModal() Modal is closed!');
      //$scope.fullScreenModal.hide();
      $scope.fullScreenModal.remove();
        $ionicModal.fromTemplateUrl('templates/image-modal.html', function(modal) {
        $scope.fullScreenModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      console.log('** PlayerHomeCtrl.$on() $destroy::Modal is destroyed!');
      //$scope.fullScreenModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('fullScreenModal.hide', function() {
        console.log('** PlayerHomeCtrl.$on() fullScreenModal.hide::Modal is hide!');
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('fullScreenModal.removed', function() {
        console.log('** PlayerHomeCtrl.$on() fullScreenModal.removed::Modal is removed!');
      // Execute action
    });
    $scope.$on('fullScreenModal.shown', function() {
        console.log('** PlayerHomeCtrl.$on() fullScreenModal.shown::Modal is shown!');
    });

    $scope.fullScreen = function(img){
        $scope.imageSrc = img;
        $scope.openfullScreenModal();
    };

      $rootScope.$on('HomeBtnClicked', function (event, data) {
        console.log('** PlayerHomeCtrl.$on() HomeBtnClicked recieved');
       // $scope.projects = DataService.projects();
      });


      $scope.openPlayer = function(index) {
        console.log('>> PlayerHomeCtrl.openPlayer() index: ' + index);  
        $scope.projectindex = index;
          
        if($scope.projectsToPlay.length > 0) {
          $scope.questionTmp = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion]
          $scope.optionsTmp = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].options;
          $scope.questionImg = $scope.projectsToPlay[$scope.projectindex].questions[$scope.currentQuestion].picture_url;
        }
        $scope.playerModal.show();
        $scope.$apply;
        console.log('<< PlayerHomeCtrl.openPlayer()');
      };

      $scope.closePlayer = function() {
        console.log('>> PlayerHomeCtrl.closePlayer()');
        $scope.playerModal.hide();
        console.log('<< PlayerHomeCtrl.closePlayer()');
      };
      $scope.removePlayer = function() {
        console.log('>> PlayerHomeCtrl.destroyPlayer()');
        //$scope.playerModal.hide();
        $scope.playerModal.remove(); 
        
        $ionicModal.fromTemplateUrl('templates/player.html', function(modal) {
        $scope.playerModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        
        
          
          
        console.log('<< PlayerHomeCtrl.destroyPlayer()');
      };

    })