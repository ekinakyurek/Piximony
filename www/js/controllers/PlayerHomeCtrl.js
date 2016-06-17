angular.module('Piximony').controller('PlayerHomeCtrl', function($scope, $rootScope, $timeout, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService)  {
      //   $scope.projects = [
      //     {id: 1, name: 'Volkan\'s project 1', img: 'img/image-placeholder.png'},
      //     {id: 2, name: 'Martin\'s project 2', img: 'img/image-placeholder.png'},
      //     {id: 3, name: 'Atlas\'s project 3', img: 'img/image-placeholder.png'}
      // ];

  $scope.projectindex = 0
  $rootScope.$on('projectsToPlay', function (event, data) {
    console.log('** projectsToPlay recieved');
    //$scope.projectsToPlay = DataService.projects2Play();
    $scope.projectsToPlay = DataService.projects2Play()
    console.log($scope.projectsToPlay)

    $scope.$apply()
  });

  $rootScope.$on('questionsToPlay', function (event, data) {
    console.log("** questionsToPlay is received");
    //$scope.projectsToPlay = DataService.projects2Play();

    //$scope.questionsToPlay = DataService.questions2Play();
      //$scope.projectsToPlay = DataService.returnprojects2Play
    $scope.questionsToPlay = DataService.questions2Play()
      console.log($scope.questionsToPlay)
    $scope.currentQuestion = 0;
    $scope.currentScore = 0;


    $scope.trial = [false,false,false,false];
    $scope.bingo = false;
    $scope.$apply()
  });





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
        console.log('>> nextQuestion');
        $scope.closefullScreenModal();
        $scope.trial = [false,false,false,false];
        $scope.bingo = false;

        console.log('** nextQuestion:: $scope.currentQuestion:',$scope.currentQuestion);
        console.log('** nextQuestion:: $scope.questionsToPlay.length:',$scope.questionsToPlay[$scope.projectindex].length);
        if($scope.currentQuestion < $scope.questionsToPlay[$scope.projectindex].length-1)
            $scope.currentQuestion++;
        else
        {
            $scope.currentQuestion = 0;
            $scope.currentScore = 0;
            $scope.closePlayer();
        }
        $scope.questionTmp = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion];
        $scope.optionsTmp = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].options;
        $scope.questionImg = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].img;
        console.log('<< nextQuestion');
    };

      $scope.optionSelected = function(option) {
          console.log('>> optionSelected : (' + option + ')');
          //alert(option);
          //alert($scope.questionsToPlay[1].answer);
          var selectedIndex = $scope.optionsTmp.indexOf(option);

          //alert(selectedIndex);
          console.log('** optionSelected:: selectedIndex:('+selectedIndex+')');
          //alert($scope.questionsToPlay[1].answer.charCodeAt(0));
          //alert('A'.charCodeAt(0));

          if($scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].answer == selectedIndex)
            {
                console.log('** optionSelected:: BINGO');
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
                console.log('** optionSelected:: SORRY');
                $scope.trial[selectedIndex] = true;
            }
          console.log('<< optionSelected::');
      };

        $scope.isThisDisabled = function(option) {
            console.log('>> isThisDisabled:: for: (' + option + ')');
            var Index = $scope.optionsTmp.indexOf(option);
            console.log('** isThisDisabled::Index:' + Index);
            if(($scope.trial[Index] == true | $scope.bingo == true) & !($scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].answer == Index))
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

            var Index = $scope.optionsTmp.indexOf(option);
            console.log('** isThisChecked::Index:' + Index);
            if($scope.trial[Index] == true & !($scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].answer))
            {
               console.log('<< isThisChecked:: false for: (' + option + ')');
               return false;
            }
            else{

              console.log('<< isThisChecked:: not changed for: (' + option + ')');
            }

             return false;
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


      $scope.openPlayer = function(index) {
        $scope.projectindex = index
        if($scope.questionsToPlay.length > 0) {
          $scope.questionTmp = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion];
          $scope.optionsTmp = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].options;
          $scope.questionImg = $scope.questionsToPlay[$scope.projectindex][$scope.currentQuestion].remote;
        }
        $scope.playerModal.show();
      };

      $scope.closePlayer = function() {
        $scope.playerModal.hide();
      };

    })