angular.module('Piximony').controller('QuestionsHomeCtrl', function($scope, $rootScope, $timeout, $state, $stateParams, $ionicModal, $cordovaDevice, $cordovaFile, $ionicHistory, $ionicPlatform, $ionicActionSheet, $ionicListDelegate, $ionicPopup, ImageService, DataService, WebService, CacheService)  {
        //alert($stateParams.projectId);
        CacheService.loadCache($scope.isPLaying)
        $scope.users = [];
        $scope.selectedUsers = [];
        $scope.isPLaying = false;
        $scope.isThumbnail = true;
        $scope.isnewQuestionModalActive     = false;
        $scope.isupdateQuestionModalActive  = false;
        $scope.iseditImageModalActive       = false;
        $scope.project = $stateParams.project;



        $scope.projectID = $scope.project.project_id;
        $scope.questions = $scope.project.questions;
        $scope.getCachedValue = CacheService.getCachedValue;
        $scope.filter = {xAxisPrcnt: 0, yAxisPrcnt: 0, heightPrcnt: 0, widthPrcnt: 0};

    $scope.goBack = function(){
        $ionicHistory.goBack()
    }



    $scope.showConfirm = function(question) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deleting question',
            template: 'Are you sure you want to delete this question?'
        });

        confirmPopup.then(function(res) {
            $ionicListDelegate.closeOptionButtons();
            if(res) {
               $scope.delete_question(question)
            } else {
                console.log('You are not sure');
            }
        });
    };
    
    $scope.delete_question = function (question) {

         WebService.delete_question(question.question_id, function (result, info){
             if (result) {
                 console.log("success")
                 qindex = $scope.questions.map(function (e) {
                     return e.question_id;
                 }).indexOf(question.question_id);
                 $scope.questions.splice(qindex, 1)
             }
         })

          
    }
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
        $scope.$on('modal.shown', function(event,modal){
            console.log(">> QuestionsHomeCtrl::$on(modal.shown) modal.id:"+modal.id);
            if(modal.id == "editImageModal"){
                $scope.iseditImageModalActive = true;
            }
            else if (modal.id == "newQuestionModal"){
                $scope.isnewQuestionModalActive = true;
                //$scope.resetObject();
            }
            else if(modal.id == "updateQuestionModal"){
                $scope.isupdateQuestionModalActive = true;
            }
            $scope.redrawObjects();
            console.log("<< QuestionsHomeCtrl::$on(modal.shown)");
        });

        $scope.syncElementsonEditImage = function() {
            console.log(">> QuestionsHomeCtrl::syncElementsonEditImage()");
            document.getElementById("mySvg").style.height   = document.getElementById("myImage").height;
            document.getElementById("mySvg").style.width    = document.getElementById("myImage").width;
            document.getElementById("mySvg").style.left     = document.getElementById("myImage").x;
            document.getElementById("mySvg").style.top      = document.getElementById("myImage").y;
            console.log("<< QuestionsHomeCtrl::syncElementsonEditImage()");
        };
        $scope.syncElementsonNewQuestion = function() {
            console.log(">> QuestionsHomeCtrl::syncElementsonNewQuestion()");
            document.getElementById("mySvgN").style.height = document.getElementById("myImageN").height;
            document.getElementById("mySvgN").style.width  = document.getElementById("myImageN").width;
            document.getElementById("mySvgN").style.left   = document.getElementById("myImageN").style.left;
            document.getElementById("mySvgN").style.top    = document.getElementById("myImageN").style.top;
            console.log("<< QuestionsHomeCtrl::syncElementsonNewQuestion()");
        };
        $scope.syncElementsonEditQuestion = function() {
            console.log(">> QuestionsHomeCtrl::syncElementsonEditQuestion()");
            document.getElementById("mySvgE").style.height = document.getElementById("myImageE").height;
            document.getElementById("mySvgE").style.width  = document.getElementById("myImageE").width;
            document.getElementById("mySvgE").style.left   = document.getElementById("myImageE").style.left;
            document.getElementById("mySvgE").style.top    = document.getElementById("myImageE").style.top;
            console.log("<< QuestionsHomeCtrl::syncElementsonEditQuestion()");
        };

        $scope.updateFilter = function(){
            console.log(">> QuestionsHomeCtrl::updateFilter()");
            $scope.filter.xAxisPrcnt    = document.getElementById("myRect").getAttribute("x")/document.getElementById("myImage").width;
            $scope.filter.yAxisPrcnt    = document.getElementById("myRect").getAttribute("y")/document.getElementById("myImage").height;
            $scope.filter.heightPrcnt   = document.getElementById("myRect").getAttribute("height")/document.getElementById("myImage").height;
            $scope.filter.widthPrcnt    = document.getElementById("myRect").getAttribute("width")/document.getElementById("myImage").width;

            console.log("** QuestionsHomeCtrl::updateFilter() filter.xAxisPrcnt:"   + $scope.filter.xAxisPrcnt);
            console.log("** QuestionsHomeCtrl::updateFilter() filter.yAxisPrcnt:"   + $scope.filter.yAxisPrcnt);
            console.log("** QuestionsHomeCtrl::updateFilter() filter.heightPrcnt:"  + $scope.filter.heightPrcnt);
            console.log("** QuestionsHomeCtrl::updateFilter() filter.widthPrcnt:"   + $scope.filter.widthPrcnt);
            console.log("<< QuestionsHomeCtrl::updateFilter()");
        };


        $scope.resetFilter = function () {
            console.log(">> QuestionsHomeCtrl::resetFilter()");
            $scope.filter.xAxisPrcnt    = 0;
            $scope.filter.yAxisPrcnt    = 0;
            $scope.filter.heightPrcnt   = 0;
            $scope.filter.widthPrcnt    = 0;
            console.log("<< QuestionsHomeCtrl::resetFilter()");
        };

        window.addEventListener("orientationchange", function(){
            console.log('>> QuestionsHomeCtrl.Orientation changed to ' + screen.orientation);
            $scope.redrawObjects();
            console.log('>> QuestionsHomeCtrl.Orientation()');
        });

        $scope.redrawObjects = function () {
            console.log('>> QuestionsHomeCtrl.redrawObjects()');
            if($scope.isnewQuestionModalActive){
                $scope.resetFilter();
                $scope.syncElementsonNewQuestion();
                $scope.updateObjectonNewQuestion();
            }
            if($scope.isupdateQuestionModalActive){
                $scope.syncElementsonEditQuestion();
                $timeout($scope.updateObjectonEditQuestion,300);
            }
            if($scope.iseditImageModalActive){
                $scope.syncElementsonEditImage();
                $scope.updateObjectonEditImage();
            }
            console.log('<< QuestionsHomeCtrl.redrawObjects()');
        };
    
        $scope.resetObject = function(){
            console.log(">> QuestionsHomeCtrl.resetObject()");
            $scope.syncElementsonEditImage();
            if($scope.isnewQuestionModalActive)
                $scope.syncElementsonNewQuestion();
            else
                $scope.syncElementsonEditQuestion();

            $scope.xPosition1 = 0;
            $scope.xPosition2 = 0;
            $scope.yPosition1 = 0;
            $scope.yPosition2 = 0;
            $scope.changeLocation(0,0);
            $scope.changeSize(0,0);
            console.log("<< QuestionsHomeCtrl.resetObject()");
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

        $scope.updateObjectonEditImage = function(){
            console.log(">> QuestionsHomeCtrl.updateObjectonEditImage()");
            document.getElementById("myRect").setAttribute("x",(document.getElementById("myImage").width*$scope.filter.xAxisPrcnt).toString());
            document.getElementById("myRect").setAttribute("y",(document.getElementById("myImage").height*$scope.filter.yAxisPrcnt).toString());
            document.getElementById("myRect").setAttribute("width",(document.getElementById("myImage").width*$scope.filter.widthPrcnt).toString());
            document.getElementById("myRect").setAttribute("height",(document.getElementById("myImage").height*$scope.filter.heightPrcnt).toString());
            console.log("<< QuestionsHomeCtrl.updateObjectonEditImage()");
        };
        $scope.updateObjectonNewQuestion = function(){
            console.log(">> QuestionsHomeCtrl.updateObjectonNewQuestion()");
            document.getElementById("myRectN").setAttribute("x",(document.getElementById("myImageN").width*$scope.filter.xAxisPrcnt).toString());
            document.getElementById("myRectN").setAttribute("y",(document.getElementById("myImageN").height*$scope.filter.yAxisPrcnt).toString());
            document.getElementById("myRectN").setAttribute("width",(document.getElementById("myImageN").width*$scope.filter.widthPrcnt).toString());
            document.getElementById("myRectN").setAttribute("height",(document.getElementById("myImageN").height*$scope.filter.heightPrcnt).toString());
            console.log("<< QuestionsHomeCtrl.updateObjectonNewQuestion()");
        };
        $scope.updateObjectonEditQuestion = function(){
            console.log(">> QuestionsHomeCtrl.updateObjectonEditQuestion()");
            document.getElementById("myRectE").setAttribute("x",(document.getElementById("myImageE").width*$scope.filter.xAxisPrcnt).toString());
            document.getElementById("myRectE").setAttribute("y",(document.getElementById("myImageE").height*$scope.filter.yAxisPrcnt).toString());
            document.getElementById("myRectE").setAttribute("width",(document.getElementById("myImageE").width*$scope.filter.widthPrcnt).toString());
            document.getElementById("myRectE").setAttribute("height",(document.getElementById("myImageE").height*$scope.filter.heightPrcnt).toString());
            console.log("** QuestionsHomeCtrl.updateObjectonEditQuestion() myRectE.x:"+ document.getElementById("myRectE").getAttribute("x"));
            console.log("** QuestionsHomeCtrl.updateObjectonEditQuestion() myRectE.y:"+ document.getElementById("myRectE").getAttribute("y"));
            console.log("** QuestionsHomeCtrl.updateObjectonEditQuestion() myRectE.width:"+ document.getElementById("myRectE").getAttribute("width"));
            console.log("** QuestionsHomeCtrl.updateObjectonEditQuestion() myRectE.height:"+ document.getElementById("myRectE").getAttribute("height"));
            console.log("<< QuestionsHomeCtrl.updateObjectonEditQuestion()");
        };

        $scope.$parent.$on('$ionicView.loaded', function(event) {
            console.log("** QuestionsHomeCtrl.$on($ionicView.loaded) Event:"+JSON.stringify(event));
        });

        $scope.updateObject = function(){
            console.log(">> QuestionsHomeCtrl.updateObject()");
            $scope.changeSize((Math.abs($scope.xPosition2-$scope.xPosition1)).toString(),(Math.abs($scope.yPosition2-$scope.yPosition1)).toString());
            if($scope.yPosition2 < $scope.yPosition1 & $scope.xPosition2 < $scope.xPosition1)
                $scope.changeLocation($scope.xPosition2,$scope.yPosition2);

            else if($scope.yPosition2 >= $scope.yPosition1 & $scope.xPosition2 < $scope.xPosition1)
                $scope.changeLocation($scope.xPosition2,$scope.yPosition1);

            else if($scope.yPosition2 < $scope.yPosition1 & $scope.xPosition2 >= $scope.xPosition1)
                $scope.changeLocation($scope.xPosition1,$scope.yPosition2);

            else if($scope.yPosition2 >= $scope.yPosition1 & $scope.xPosition2 >= $scope.xPosition1)
                $scope.changeLocation($scope.xPosition1,$scope.yPosition1);

            $scope.updateFilter();
            if($scope.isnewQuestionModalActive)
                $scope.updateObjectonNewQuestion();
            if($scope.iseditImageModalActive)
                $scope.updateObjectonEditQuestion();

            console.log("<< QuestionsHomeCtrl.updateObject()");
        };

        $scope.getMouseMovePosition = function() {
            //console.log("** QuestionsHomeCtrl.getMouseMovePosition()");
            if($scope.fClicked == true)
            {
                var Position = $scope.getTouchposition(event);
                $scope.xPosition2 = Position.x;
                $scope.yPosition2 = Position.y;    
                $scope.updateObject();
            }    
        };
                         
        $scope.getMouseUpPosition = function() {
            //console.log("** QuestionsHomeCtrl.getMouseUpPosition()");
            $scope.fClicked = false;
            var Position = $scope.getTouchposition(event);
            $scope.xPosition2 = Position.x;
            $scope.yPosition2 = Position.y; 
            $scope.updateObject();
        };

        $scope.getMouseDownPosition = function() {
            //console.log("** QuestionsHomeCtrl.getMouseDownPosition()");
            $scope.fClicked = true;
            $scope.resetObject();
            var Position = $scope.getTouchposition(event);
            $scope.xPosition1 = Position.x;
            $scope.yPosition1 = Position.y; 
        };

        // Helper function to get an element's exact position
        $scope.getPosition = function(element) {
            //console.log(">> QuestionsHomeCtrl.getPosition()");
            var xPosition = 0;
            var yPosition = 0;

            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            //console.log("<< QuestionsHomeCtrl.getPosition(" + xPosition + "," + yPosition + ")");
            return { x: xPosition, y: yPosition };
        };
    
        $scope.getTouchposition = function(event){
            //console.log(">> QuestionsHomeCtrl.getTouchposition()");
            var canvasPosition = $scope.getPosition(event.gesture.touches[0].target);

            var tap = { x:0, y:0 };
                    if(event.gesture.touches.length>0){
                    tt = event.gesture.touches[0];
                    tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
                    tap.y = tt.clientY || tt.pageY || tt.screenY ||0;  
                    }
            tap.x = tap.x - canvasPosition.x;
            tap.y = tap.y - canvasPosition.y;
            //console.log("<< QuestionsHomeCtrl.getTouchposition(" + tap.x + "," + tap.y + ")");
            return {x: tap.x, y: tap.y};
        };

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
            $scope.iseditImageModalActive = false;
            $scope.editImageModal.remove();
            $ionicModal.fromTemplateUrl('templates/edit-image.html', function(modal) {
                $scope.editImageModal = modal;
                }, {
                    id: "editImageModal",
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
            id: "newQuestionModal",
            scope: $scope,
            animation: 'slide-in-up'
        });
        
    
        $ionicModal.fromTemplateUrl('templates/edit-question.html', function(modal) {
            $scope.updateQuestionModal = modal;
        }, {
            id: "updateQuestionModal",
            scope: $scope,
            animation: 'slide-in-up'
        });
    
        $ionicModal.fromTemplateUrl('templates/edit-image.html', function(modal) {
            $scope.editImageModal = modal;
            }, {
            id: "editImageModal",
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
            if(result){
                        CacheService.addPair(response.picture_url, name, $scope.isPLaying, false)


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
            $scope.isnewQuestionModalActive = false;
            $scope.questionModal.remove();
            $ionicModal.fromTemplateUrl('templates/new-question.html', function(modal) {
                $scope.questionModal = modal;
            }, {
                id: "newQuestionModal",
                scope: $scope,
                animation: 'slide-in-up'
            });
            console.log("<< QuestionsHomeCtrl.closeNewQuestion()");
        };
    
        $scope.showQuestionDetails = function(question) {


            console.log(">> QuestionsHomeCtrl.showQuestionDetails() question:"+ question);
            $scope.questionTmp = DataService.clone(question);
            $scope.questionImg = $scope.questionTmp.picture_url
            $scope.filter =  $scope.questionTmp.filter
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
    



                $scope.questionTmp.picture_url =  cordova.file.dataDirectory + name
                $scope.questionTmp.thumbnail_url =    $scope.questionTmp.picture_url
                $scope.questionTmp.img =     $scope.questionTmp.picture_url
                $scope.questionTmp.name = name
                $scope.questionTmp.url =    $scope.questionTmp.picture_url
                $scope.questionImg =     $scope.questionTmp.picture_url


                // console.log("** QuestionsHomeCtrl.updatePic() Pic Index: " + i);
                // console.log("** QuestionsHomeCtrl.updatePic() Pic Path:" + $scope.questions[i].img);
                // console.log('** QuestionsHomeCtrl.updatePic() name:' + $scope.questions[i].name);
    
            });
            console.log("<< QuestionsHomeCtrl.updatePic()");
        };

        // Close the new task modal
        $scope.closeUpdateQuestion = function() {
            console.log(">> QuestionsHomeCtrl.closeUpdateQuestion()");
            $scope.questionTmp = {}
            $scope.isupdateQuestionModalActive = false;
            $scope.updateQuestionModal.remove();
            $ionicModal.fromTemplateUrl('templates/edit-question.html', function(modal) {
                $scope.updateQuestionModal = modal;
            }, {
                id: "updateQuestionModal",
                scope: $scope,
                animation: 'slide-in-up'
            });


            console.log("<< QuestionsHomeCtrl.closeUpdateQuestion()");
        };

        $scope.updateQuestion = function(question) {
            console.log(">> QuestionsHomeCtrl.updateQuestion() quesstionID:" + question.question_id)

            for(var i = 0; i < $scope.questions.length; i += 1) {
                if ($scope.questions[i].question_id == question.question_id) {
                    console.log(i)
                    $scope.questions[i] = DataService.clone(question);
                    break;
                }
            }


            // VB
            // Reset the filter for the new picture and update the dialog
            $scope.project.thumbnail_url = question.thumbnail_url
            $scope.resetFilter();
            question.filter      =   $scope.filter;
            $scope.updateObjectonEditQuestion();

    
            DataService.storeQuestions($scope.questions, $scope.project.project_id)



            WebService.update_question(question,question.name,function(result,response){
                if (result==true){
                    console.log(JSON.stringify(response))
                  if(question.name !== undefined) {
                        CacheService.addPair(response.picture_url, question.name, $scope.isPlaying, false)
                        CacheService.addPair(response.thumbnail_url, question.name, $scope.isPlaying, true)
                    }
    

                }else{
                    console.log("error:" + JSON.stringify(response))
                }
            });
            //DataService.storeQuestions($scope.questions,$scope.projectID);
            $scope.questionTmp = {}
            $scope.updateQuestionModal.hide();
            console.log("<< QuestionsHomeCtrl.updateQuestion()");
        };
    });
