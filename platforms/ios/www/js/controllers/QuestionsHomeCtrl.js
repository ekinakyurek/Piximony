angular.module('Piximony').controller('QuestionsHomeCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, DataService, WebService, CacheService)  {
        //alert($stateParams.projectId);
        $scope.users = []
        $scope.selectedUsers = []
        $scope.isPLaying = false
        $scope.isThumbnail = true
        $scope.project = $stateParams.project
        $scope.projectID = $scope.project.project_id;
        $scope.questions = $scope.project.questions
        $scope.getCachedValue = CacheService.getCachedValue
        $scope.filter = {xAxis: 0, yAxis: 0, heightPrcnt: 0, widthPrcnt: 0};

        $scope.doRefresh = function(){

            WebService.get_questions($scope.project.project_id, function (result, questions) {
                if (result==true) {
                    $rootScope.$broadcast('projectQuestions',questions);
                    console.log(questions)
                    $scope.$broadcast('scroll.refreshComplete');
                }else{
                    $rootScope.$broadcast('projectQuestions',DataService.getQuestions($scope.project.project_id))
                    alert("Your are offline!")
                    $scope.$broadcast('scroll.refreshComplete');
                }
            })

        };
        window.addEventListener("orientationchange", function(){
            console.log('** QuestionsHomeCtrl.Orientation changed to ' + screen.orientation);
            document.getElementById("mySvg").style.height = document.getElementById("myImage").height;
            document.getElementById("mySvg").style.width  = document.getElementById("myImage").width;
            document.getElementById("mySvg").style.left   = document.getElementById("myImage").x;
            document.getElementById("mySvg").style.top    = document.getElementById("myImage").y;
        });
    
        $scope.resetObject = function(){
            console.log("** QuestionsHomeCtrl.resetObject()");
            
            document.getElementById("mySvg").style.height = document.getElementById("myImage").height;
            document.getElementById("mySvg").style.width  = document.getElementById("myImage").width;
            document.getElementById("mySvg").style.left   = document.getElementById("myImage").x;
            document.getElementById("mySvg").style.top    = document.getElementById("myImage").y;
            
            $scope.xPosition1 = 0;
            $scope.xPosition2 = 0;
            $scope.yPosition1 = 0;
            $scope.yPosition2 = 0;
            $scope.changeLocation(0,0);
            $scope.changeSize(0,0);
        };
        $scope.changeLocation = function(x,y){
            console.log("** QuestionsHomeCtrl.changeLocation(" + x + "," + y + ")");
            document.getElementById("myRect").setAttribute("x",x.toString());
            document.getElementById("myRect").setAttribute("y",y.toString());
        };
        $scope.changeSize = function(w,h){
            console.log("** QuestionsHomeCtrl.changeSize(" + w + "," + h + ")");
            document.getElementById("myRect").setAttribute("width",w.toString());
            document.getElementById("myRect").setAttribute("height",h.toString());
        };

        $scope.updateObject = function(){
            $scope.changeSize((Math.abs($scope.xPosition2-$scope.xPosition1)).toString(),(Math.abs($scope.yPosition2-$scope.yPosition1)).toString());
            if($scope.yPosition2 < $scope.yPosition1 & $scope.xPosition2 < $scope.xPosition1)
                $scope.changeLocation($scope.xPosition2,$scope.yPosition2);

            else if($scope.yPosition2 >= $scope.yPosition1 & $scope.xPosition2 < $scope.xPosition1)
                $scope.changeLocation($scope.xPosition2,$scope.yPosition1);

            else if($scope.yPosition2 < $scope.yPosition1 & $scope.xPosition2 >= $scope.xPosition1)
                $scope.changeLocation($scope.xPosition1,$scope.yPosition2);

            else if($scope.yPosition2 >= $scope.yPosition1 & $scope.xPosition2 >= $scope.xPosition1)
                $scope.changeLocation($scope.xPosition1,$scope.yPosition1);
        };

        $scope.getMouseMovePosition = function() {
            console.log("** QuestionsHomeCtrl.getMouseMovePosition()");
            if($scope.fClicked == true)
            {
                var Position = $scope.getTouchposition(event);
                $scope.xPosition2 = Position.x;
                $scope.yPosition2 = Position.y;    
                $scope.updateObject();
            }    
        };
                         
        $scope.getMouseUpPosition = function() {
            console.log("** QuestionsHomeCtrl.getMouseUpPosition()");
            $scope.fClicked = false;
            var Position = $scope.getTouchposition(event);
            $scope.xPosition2 = Position.x;
            $scope.yPosition2 = Position.y; 
            $scope.updateObject();
        };

        $scope.getMouseDownPosition = function() {
            console.log("** QuestionsHomeCtrl.getMouseDownPosition()");
            $scope.fClicked = true;
            $scope.resetObject();
            var Position = $scope.getTouchposition(event);
            $scope.xPosition1 = Position.x;
            $scope.yPosition1 = Position.y; 
        };

        // Helper function to get an element's exact position
        $scope.getPosition = function(element) {
            console.log(">> QuestionsHomeCtrl.getPosition()");
            var xPosition = 0;
            var yPosition = 0;

            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            console.log("<< QuestionsHomeCtrl.getPosition(" + xPosition + "," + yPosition + ")");
            return { x: xPosition, y: yPosition };
        };
    
        $scope.getTouchposition = function(event){
            console.log(">> QuestionsHomeCtrl.getTouchposition()");
            var canvasPosition = $scope.getPosition(event.gesture.touches[0].target);

            var tap = { x:0, y:0 };
                    if(event.gesture.touches.length>0){
                    tt = event.gesture.touches[0];
                    tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
                    tap.y = tt.clientY || tt.pageY || tt.screenY ||0;  
                    }
            tap.x = tap.x - canvasPosition.x;
            tap.y = tap.y - canvasPosition.y;
            console.log("<< QuestionsHomeCtrl.getTouchposition(" + tap.x + "," + tap.y + ")");
            return {x: tap.x, y: tap.y};
        };



        console.log("$scope.questions ::  " +  $scope.questions)
        $rootScope.$on('projectQuestions', function (event, data) {
            console.log("** QuestionsHomeCtrl.$on() projectQuestions is broadcasted:" + $scope.projectID);
            if (data.length > 0) {
                $scope.questions = data
                DataService.storeQuestions(data, $scope.projectID)
                console.log(JSON.stringify(data))
            }
        });
    
   


        $scope.openEditImage = function(){
            console.log(">> QuestionsHomeCtrl.openEditImage()");
            $scope.fClicked = false;
            $scope.editImageModal.show();
            
            console.log("<< QuestionsHomeCtrl.openEditImage()");
        };
        $scope.closeEditImageModal = function() {
            console.log('** QuestionsHomeCtrl.closeEditImageModal() Modal is closed!');
            
            console.log("filter.height:" + document.getElementById("myRect").getAttribute("height")/document.getElementById("myImage").height);
            console.log("filter.width:" + document.getElementById("myRect").getAttribute("width")/document.getElementById("myImage").width);
            console.log("filter.left:" + document.getElementById("myRect").getAttribute("x"));
            console.log("filter.top:" + document.getElementById("myRect").getAttribute("y"));
            
            
            
            $scope.filter.xAxis         = document.getElementById("myRect").getAttribute("x");
            $scope.filter.yAxis         = document.getElementById("myRect").getAttribute("y");
            $scope.filter.heightPrcnt    = document.getElementById("myRect").getAttribute("height")/document.getElementById("myImage").height;
            $scope.filter.widthPrcnt     = document.getElementById("myRect").getAttribute("width")/document.getElementById("myImage").width;
            
            $scope.editImageModal.remove();
            $ionicModal.fromTemplateUrl('templates/edit-image.html', function(modal) {
                $scope.editImageModal = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
            });
        };
    
    
      
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
            ImageService.handleMediaDialog(type, function(result, name) {
                $scope.questionImg = name;
                $scope.newQuestion(name);
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
        
    
        $ionicModal.fromTemplateUrl('templates/edit-question.html', function(modal) {
            $scope.updateQuestionModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    
        $ionicModal.fromTemplateUrl('templates/edit-image.html', function(modal) {
            $scope.editImageModal = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });

    
        $scope.home = function() {
            console.log("** QuestionsHomeCtrl.home() HomeBtnClicked sent");
            $scope.currentView = false
            $scope.questions = []
            $rootScope.$broadcast('HomeBtnClicked'); // $rootScope.$on && $scope.$on
            $state.go('MainPage');
    
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
                thumbnail_url:  $scope.questionImg,
                name: name,
                filter: $scope.filter
            }


            $scope.questions.unshift(question);

            DataService.storeQuestion(question, $scope.projectID)

            WebService.create_question(question,function(result,response){
                if (result == true){
                    CacheService.addPair(response.picture_url, name, $scope.isPLaying)
                }else{
                    alert("There was an error when creating question")
                }
            })

            $scope.questionModal.hide();

            console.log("<< QuestionsHomeCtrl.createQuestion()");
        };

        $scope.newQuestion = function(img) {
            console.log(">> QuestionsHomeCtrl.newQuestion(" + img + ")");
            $scope.questionTmp = {};
            $scope.questionImg = cordova.file.dataDirectory + img ;
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
                        console.log("questions")
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
            ImageService.handleMediaDialog(type, function(result, name) {
    
                $scope.question.picture_url =  cordova.file.dataDirectory + name
                $scope.question.img =  $scope.question.picture_url
                $scope.question.name = name
                $scope.question.url =  $scope.question.picture_url
                $scope.questionImg =   $scope.question.picture_url
    
                for(var i = 0; i < $scope.questions.length; i += 1){
                    if($scope.questions[i].question_id == questionID){
                        console.log(i)
                        $scope.questions[i] = $scope.question;
                        break;
                    }
                }
    
    
                console.log("** QuestionsHomeCtrl.updatePic() Pic Index: " + i);
                console.log("** QuestionsHomeCtrl.updatePic() Pic Path:" + $scope.questions[i].img);
                console.log('** QuestionsHomeCtrl.updatePic() name:' + $scope.questions[i].name);
    
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
                if ($scope.questions[i].question_id == question.question_id) {
                    console.log(i)
                    $scope.questions[i] = question;
                    break;
                }
            }
    
            DataService.storeQuestion(question, $scope.projectID)
    
            WebService.update_question(question,question.name,function(result,response){
                if (result==true){
                    console.log(JSON.stringify(response))
                    CacheService.addPair(response.picture_url, question.name, $scope.isPlaying)
    
                }else{
                    console.log("error:" + JSON.stringify(response))
                }
            })
            //DataService.storeQuestions($scope.questions,$scope.projectID);
            $scope.updateQuestionModal.hide();
            console.log("<< QuestionsHomeCtrl.updateQuestion()");
        };
    });
