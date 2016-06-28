angular.module('Piximony').factory('DataService', function($rootScope) {

  var images;
  var questions;
  var projects;
  var projects2Play;
  var questions2Play;
  
  var userObjectId = ""
  var Currentusername = ""
  var IMAGE_STORAGE_KEY = 'images';
  var QUESTION_STORAGE_KEY = 'questions';
  var PROJECT_STORAGE_KEY = 'projects';

  var pImages = Parse.Object.extend("pImages");
  var pProjects = Parse.Object.extend("pProjects");
  var pQuestions = Parse.Object.extend("pQuestions");
  //
  // var parseImages = new pImages();
  // var parseProjects = new pProjects();
  // var parseQuestions = new pQuestions();
  
  function shareAProject(projectId, users){
    console.log(">> DataService.shareAProject(" + projectId + "," + users + ")");
    var shared = Parse.Object.extend("shares"); 
    var query = new Parse.Query(shared);
    query.containedIn("username", users);  // find all the women
    return query.find({
      success: function(users) {
        
         for(var i=0; i < users.length; i++){
           
           users[i].addUnique("Projects2Play",projectId)
           users[i].save()
            
           console.log("** DataService.shareAProject() sucessfully shared");
      }},error: function(error){
        
      }
    });
    console.log("<< DataService.shareAProject()");
  };
  
  function addFriend(username){
    console.log(">> DataService.addFriend(" + username + ")");      
    var friends = Parse.Object.extend("friends"); 
    var query = new Parse.Query(friends);
    query.equalTo("username", Currentusername);  // find all the women
    return query.first({
      success: function(user) {
        if(user != undefined){
           user.addUnique("friends",username)
           user.save()
           console.log("** DataService.addFriend() sucessfully added");
        }else{
            var friend = new friends()
            friend.addUnique("friends",username)
            friend.set("username",Currentusername)
            friend.save()
        }
       //$rootScope.$broadcast('getFriends', usernames)
      },error: function(error){
        console.log("** DataService.addFriend() error when adding friends");
      }
    });
    console.log("<< DataService.addFriend()");
  };
  
  function AllUsers(){
    console.log(">> DataService.AllUsers()");
    var query = new Parse.Query(Parse.User);
   
    return query.find({
      success: function(users) {
         console.log("** DataService.AllUsers() sucessfully getting users");
         usernames = [];
         for(var i = 0; i < users.length; i ++){
           usernames.push(users[i].get("username"))
         }
         $rootScope.$broadcast('getUsers', usernames)
      },error: function(error){
        console.log("** DataService.AllUsers() error when getting users");
      }
    });
    console.log("<< DataService.AllUsers()");
  };
  
   function getFriends(){
   console.log(">> DataService.getFriends()");
    var object = Parse.Object.extend("friends");
    var query = new Parse.Query(object);
    query.equalTo("username",Currentusername)
    return query.first({
      success: function(theuser) {
        
        usernames = [];
        if(theuser != undefined){
         console.log("** DataService.getFriends() sucessfully getting friends");
         usernames = theuser.get("friends")
        }else{
          
        }
         $rootScope.$broadcast('getFriends', usernames)
      },error: function(error){
        console.log("** DataService.getFriends() error when getting friends");
      }
    });
    console.log("<< DataService.getFriends()");
  };
  
  function getProjectsToPlay() {
      console.log(">> DataService.getProjectsToPlay()");
        var shared = Parse.Object.extend("shares"); 
        var squery = new Parse.Query(shared);
        squery.equalTo("username",Currentusername);
        
      return squery.first({ 
        success: function(share){
           var allPlayingProjects = share.get("Projects2Play");
           var query = new Parse.Query(pProjects);
           query.containedIn("objectId",allPlayingProjects);
            query.find({
                    success: function(objects) {
                       if(objects !== undefined || objects.length != 0){
                          projects2Play = [] ;

                          for(var i = 0 ; i < objects.length ; i ++){
                            var newproject = { name : "", remote : "", url : "" , img : "", id : ""};
                            newproject.name  = objects[i].get("name");
                            newproject.id = objects[i].id;
                            newproject.url = objects[i].get("remote");
                            newproject.img = objects[i].get("remote");
                            newproject.remote = objects[i].get("remote");
                            projects2Play.push(newproject);
                          }
                            console.log("<< DataService.getProjectsToPlay() projects: (" + projects2Play + ")");
                          $rootScope.$broadcast('projectsToPlay');
                        }else{
                          projects2Play = [] ;
                          $rootScope.$broadcast('projectsToPlay');
                        }
                      },
                      error: function(error) {
                        alert("DataService::getProjectsToPlay() error:: " + error.message);
                      }
              });
        },error:function(error){} })
    };

    function getQuestionsToPlay() {
      console.log(">> DataService.getQuestionsToPlay()");
      var shared = Parse.Object.extend("shares"); 
      var squery = new Parse.Query(shared);
      squery.equalTo("username",Currentusername)
      
      return squery.first({
        success:function(share){
        
        var allPlayingProjects = share.get("Projects2Play");
        var query = new Parse.Query(pQuestions);
        query.containedIn("project_id",allPlayingProjects);
        query.find({
                  success: function(objects) {

                    if(objects !== undefined || objects.length != 0){

                    questions2Play = new Array(objects.length);
                      for(var i = 0 ; i < objects.length ; i ++){

                        var qstn = JSON.parse(objects[i].get("questions"));
                        var projectId = objects[i].get("project_id");
                        questions2Play[i] = new Array(qstn.length)
                        for(var j = 0 ; j < qstn.length ; j++){
                              var newQuestion = qstn[j];
                              newQuestion.url = newQuestion.remote;
                              newQuestion.img = newQuestion.remote;
                              newQuestion.projectId = projectId;
                              questions2Play[i][j] = newQuestion;
                        }
                      }
                        console.log("<< DataService.getQuestionsToPlay() questions: (" + questions2Play + ")");
                      $rootScope.$broadcast('questionsToPlay');
                    }else{
                        questions2Play = [] ;
                      $rootScope.$broadcast('questionsToPlay');
                    }

                  },
                  error: function(error) {
                    alert("DataService::getQuestionsToPlay() error:: " + error.message);
                  }
                });
                },
                error:function(error){
                  
                }
        });
    };
    
  function pushProjectToParse(Project){
    console.log(">> DataService.pushProjectToParse() project: " + Project.name);
    var newProject = new pProjects();
    newProject.save({name: Project.name, user_id: userObjectId, img: Project.img, url: Project.url, remote : Project.remote , username: Project.username, owner: Project.owner },
      {
        success: function(projectObject) {
          console.log("** DataService.pushProjectToParse() success:: " + Project.name);
          projects[projects.length-1].id = projectObject.id;
          $rootScope.$broadcast('pQueryCompleted');
        },
        error: function(projectObject, error) {
          alert("DataService.pushProjectToParse() error:: " + error);
        }
      });
      console.log("<< DataService.pushProjectToParse()");
    };

    function updateProjectToParse(Project,projectID){
      console.log(">> DataService.updateProjectToParse() project: " + Project.name);
      var query = new Parse.Query(pProjects);
      query.equalTo('objectId', projectID);
      query.first( {
        success: function(project) {
          project.set("name",Project.name);
          project.set("img",Project.img);
          project.set("url", Project.url);
          project.set("remote", Project.remote);
          project.save().then({
            succes:function(object) {
              console.log("** DataService.updateProjectToParse() success:: " + object.get("name"));
            },
            error:function(error){
              alert("DataService.updateProjectToParse() error:: "+ error);
            }
          });
        },
        error: function(project, error) {
            console.log("** DataService.updateProjectToParse() error:" + error);
            alert("DataService.updateProjectToParse() internal error:: "+ error);
        }
      });
      console.log("<< DataService.updateProjectToParse()");
    };
    
    function getImagesFromParse(projectID){
        console.log(">> DataService.getImagesFromParse() projectID:" + projectID);
      var query = new Parse.Query(pImages);
      query.equalTo("user_id", userObjectId);
      query.equalTo("project_id", projectID);
      query.first({
        success: function(object) {
          if(object !== undefined){
            var img = object.get("images");
            images = JSON.parse(img);
            $rootScope.$broadcast('iQueryCompleted');
            console.log("** DataService.getImagesFromParse() success: iQueryCompleted sent")
          }
        },
        error: function(error) {
            console.log("** DataService.getImagesFromParse() error:" + error.message);
            alert("DataService::getImagesFromParse() error:: " + error.message);
        }
      });
        console.log("<< DataService.getImagesFromParse()");
    };
    
    function getQuestionsFromParse(projectID) {
        console.log(">> DataService.getQuestionsFromParse() projectID:" + projectID);
          var query = new Parse.Query(pQuestions);
          query.equalTo("user_id", userObjectId);
          query.equalTo("project_id", projectID);
          query.first({
            success: function(object){
              if(object !== undefined){
                var qst=object.get("questions");
                questions = JSON.parse(qst);
                $rootScope.$broadcast('qQueryCompleted');
                console.log("** DataService.getQuestionsFromParse() success:: qQueryCompleted sent");
              }
            },
            error: function(error) {
                console.log("** DataService.getQuestionsFromParse() error:" + error.message);
                alert("DataService::getQuestionsFromParse() error:: " + error.message);
            }
          });
        console.log("<< DataService.getQuestionsFromParse()");
    };
    
    function getProjectsFromParse(){
    console.log(">> DataService.getProjectsFromParse()");
      var query = new Parse.Query(pProjects);
      query.equalTo("user_id", userObjectId);
      query.find({
        success: function(obj) {
          projects = [];
          for (var i = 0; i < obj.length; i++) {
            projects.push({ id : obj[i].id, name : obj[i].get("name"), img : obj[i].get("img"), url: obj[i].get("url") , remote: obj[i].get("remote") } );
          }
          $rootScope.$broadcast('pQueryCompleted');
          console.log("DataService::getProjectsFromParse() success:: pQueryCompleted sent");
        },
        error: function(error) {
          alert("DataService::getProjectsFromParse() error:: " + error.message);
        }
      });
    };
    function addImageToParse(jsonImages,projectID){
      var query = new Parse.Query(pImages);
      query.equalTo("user_id", userObjectId);
      query.equalTo("project_id", projectID);
      query.first({
        success: function(object) {
          if(object !== undefined){
            object.set("images",jsonImages);
            object.save();
            console.log("DataService::addImageToParse() success::");
          }else{
            var image = new pImages();
            image.set('images',jsonImages);
            image.set('user_id',userObjectId);
            image.set('project_id', projectID);
            image.save();
            console.log('DataService::addImageToParse() success:: FirstImage');
          }
        },
        error: function(error) {
          alert("DataService::addImageToParse() error:: " + error.message);
        }
      });
    };
    function deleteImageFromParse(img,projectID){
      var query = new Parse.Query(pImages);
      query.equalTo("user_id", userObjectId);
      query.equalTo("project_id", projectID);
      query.first({
        success: function(object) {
          object.set("images",img);
          object.save();
          console.log("DataService::deleteImageFromParse() success");
        },
        error: function(error) {
          alert("DataService::deleteImageFromParse() error:: " + error.message);
        }
      });
    };
    function saveQuestionsToParse(jsonQuestions,projectID){
      var query = new Parse.Query(pQuestions);
      query.equalTo("user_id", userObjectId);
      query.equalTo("project_id", projectID);
      query.first({
        success: function(object) {
          if(object !== undefined){
            object.set("questions",jsonQuestions);
            object.save();
            console.log("DataService::saveQuestionsToParse() sucess");
          }else{
            var question = new pQuestions();
            question.set('questions',jsonQuestions);
            question.set('user_id',userObjectId);
            question.set('project_id',projectID);
            question.save();
            console.log("DataService::saveQuestionsToParse() sucess:: FirstQuestion");
          }
        },
        error: function(error) {
          alert("DataService::saveQuestionsToParse() error:: " + error.message);
        }
      });
    }
    function getImages(projectID) {
      console.log(">> DataService::getImages() for projectID::" + projectID);
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY + projectID);
      if (img) {
        images = JSON.parse(img);
      }else {
        images = [];
      }
      getImagesFromParse(projectID);
      console.log("<< DataService::getImages() length:: " + images.length);
      return images;
    };

    function getQuestions(projectID) {
      console.log(">> DataService::getQuestions() for projectID::" + projectID);
      var qst = window.localStorage.getItem(QUESTION_STORAGE_KEY + projectID);
      if (qst) {
        questions = JSON.parse(qst);
      }else {
        questions = [];
      }
      getQuestionsFromParse(projectID);
      console.log("<< DataService::getQuestions() length:: " + questions.length );
      return questions;
    };

    function getProjects() {
      console.log(">> DataService::getProjects()");
      var prj = window.localStorage.getItem(PROJECT_STORAGE_KEY);
      if (prj) {
        projects = JSON.parse(prj);
      }else {
        projects = [];
      }
      getProjectsFromParse();
      console.log("<< DataService::getProjects() length:: " + projects.length );
      return projects;
    };

      function updateQuestion(question,projectID){

         for(var i = 0; i <  questions.length; i += 1){
            if(parseInt(questions[i].id) == parseInt(question.id)){
              break;
            }
        }

          questions[i] = question
          saveQuestions(questions,projectID);
    }


    function addImage(img, projectID) {
      console.log(">> DataService::addImage() img: " + img);
      images.push(img);
      var jsonImages = JSON.stringify(images);
      window.localStorage.setItem(IMAGE_STORAGE_KEY + projectID, jsonImages);
      addImageToParse(jsonImages,projectID);
      console.log("<< DataService::addImage()");
    };

    function deleteImage(img,projectID) {
      console.log(">> DataService::deleteImage() img: " + img);
      var index = images.indexOf(img);
      if(index > -1) {
        images.splice(index, 1);
      }
      var jsonImages = JSON.stringify(images);
      window.localStorage.setItem(IMAGE_STORAGE_KEY + projectID, jsonImages);
      deleteImageFromParse(jsonImages,projectID);
      console.log("<< DataService::deleteImage()");
    };

    function saveQuestions(questions,projectID) {
      console.log(">> DataService::saveQuestions() questions: " + questions.length);
      var jsonQuestions = JSON.stringify(questions);
      window.localStorage.setItem(QUESTION_STORAGE_KEY + projectID, jsonQuestions);
      questions = jsonQuestions;
      saveQuestionsToParse(jsonQuestions,projectID);
      console.log("<< DataService::saveQuestions()");
    };

    function saveProjects(Projects) {
      console.log(">> DataService::saveProjects()");
      projects = Projects;
      console.log("DataService::saveProjects() pQueryCompleted sent");
      var jsonProjects = JSON.stringify(projects);
      window.localStorage.setItem(PROJECT_STORAGE_KEY, jsonProjects);
      console.log("<< DataService::saveProjects()");
    };

    function returnProjects(){
      return projects;
    }
    function returnImages(){
      return images;
    }
    function returnQuestions(){
      return questions;
    }
    function returnprojects2Play(){
   return projects2Play;
 }
 function returnquestions2Play(){
   return questions2Play;
 }
    return {
      storeImage: addImage,
      removeImage: deleteImage,
      images: getImages,
      questions: getQuestions,
      storeQuestions: saveQuestions,
      projects: getProjects,
      storeProjects: saveProjects,
      globalprojects: returnProjects,
      globalimages: returnImages,
      globalquestions: returnQuestions,
      pushProject: pushProjectToParse,
      updateProject: updateProjectToParse,
      projectsToPlay: getProjectsToPlay,
      questionsToPlay: getQuestionsToPlay,
      updateQuestion: updateQuestion,
      projects2Play : returnprojects2Play,
      questions2Play : returnquestions2Play,
      shareProject: shareAProject,
      getMyFriends: getFriends,
      getAllUsers: AllUsers,
      addFriend:addFriend 
    }
  })