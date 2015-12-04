angular.module('Piximony')

.factory('DataService', function() {

  var images;
  var questions;
  var projects;

  var userObjectId = Parse.User.current().id;
  var IMAGE_STORAGE_KEY = 'images';
  var QUESTION_STORAGE_KEY = 'questions';
  var PROJECT_STORAGE_KEY = 'projects';
 
  var pImages = Parse.Object.extend("pImages");
  var pProjects = Parse.Object.extend("pProjects");
  var pQuestions = Parse.Object.extend("pQuestions");

  var parseImages = new pImages();
  var parseProjects = new pProjects();
  var parseQuestions = new pQuestions();


  function getImages() {
    console.log(">> DataService::getImages()");
     var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    
      var query = new Parse.Query(pImages);
      query.equalTo("user_id", userObjectId);
      query.first({
            success: function(object) {
                    img = object.images;
                                      },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                }
          });
          
    if (img) {
      images = JSON.parse(img);
    }
    else {
      images = [];
    }
    console.log("<< DataService::getImages() images: (" + images + ")" );
    return images;
  };
 
  function getQuestions() {
    console.log(">> DataService::getQuestions()");
    var qst = window.localStorage.getItem(QUESTION_STORAGE_KEY);
      var query = new Parse.Query(pQuestions);
      query.equalTo("user_id", userObjectId);
      query.first({
            success: function(object) {
                    qst=object.questions;
                                      },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                }
                });
          
    if (qst) {
      questions = JSON.parse(qst);
    }
    else {
      questions = [];
    }
    console.log("<< DataService::getQuestions() questions: (" + questions + ")" );
    return questions;
  };
  
  function getProjects() {
    console.log(">> DataService::getProjects()");
    var prj = window.localStorage.getItem(PROJECT_STORAGE_KEY);
      var query = new Parse.Query(pProjects);
      query.equalTo("user_id", userObjectId);
      query.first({
            success: function(object) {
                    img=object.projects;
                                      },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                }
                });
          
    if (prj) {
      projects = JSON.parse(prj);
    }
    else {
      projects = [];
    }
    console.log("<< DataService::getProjects() projects: (" + projects + ")" );
    return projects;
  };

function getProjectsToPlay() {
    console.log(">> DataService::getProjectsToPlay()");

    //VBAL STARTS
    //this portion needs to be replaced with the actual Parse data provider
    projectsToPlay = [
           {id: 1, name: 'Volkan\'s project 1', img: 'img/image-placeholder.png'},
           {id: 2, name: 'Martin\'s project 2', img: 'img/image-placeholder.png'},
           {id: 3, name: 'Atlas\'s project 3', img: 'img/image-placeholder.png'}
       ];
    //VBAL ENDS
    
    console.log("<< DataService::getProjectsToPlay() projects: (" + projectsToPlay + ")" );
    return projectsToPlay;
  };
  
function getQuestionsToPlay() {
    console.log(">> DataService::getQuestionsToPlay()");

    //VBAL STARTS
    //this portion needs to be replaced with the actual Parse data provider
    questionsToPlay = [
             {id: 1, projectId: 2, title: 'Question 1', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
             {id: 2, projectId: 1, title: 'Question 2', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
             {id: 3, projectId: 2, title: 'Question 3', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
             {id: 4, projectId: 1, title: 'Question 4', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'},
             {id: 5, projectId: 1, title: 'Question 5', options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D'}, img: 'img/image-placeholder.png'}
         ];
    //VBAL ENDS
    
    console.log("<< DataService::getQuestionsToPlay() projects: (" + questionsToPlay + ")" );
    return questionsToPlay;
  };
    
  function addImage(img) {
    console.log(">> DataService::addImage() img: " + img);
    images.push(img);
    console.log("** DataService::addImage() images: " + images);
    var jsonImages = JSON.stringify(images);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images)); 
    parseImages.save({images: jsonImages, user_id: userObjectId},
                    {
                        success: function(imageObject) {
                        alert("You saved your image to our Server")
                        },
                        error: function(imageObject, error) {
                        // The save failed.
                        // error is a Parse.Error with an error code and message.
                        } 
                    });
    console.log("<< DataService::addImage()");
  };
 
  function deleteImage(img) {
    console.log(">> DataService::deleteImage() img: " + img);
    var index = images.indexOf(img);
    if(index > -1) {
        images.splice(index, 1);
    }
    var jsonImages = JSON.stringify(images);
    console.log("** DataService::deleteImage() images: " + images);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, jsonImages);
    parseImages.save({images: jsonImages,user_id: userObjectId},
                    {
                        success: function(imageObject) {
                        alert("You delete your image from our Server")
                        },
                        error: function(imageObject, error) {
                        // The save failed.
                        // error is a Parse.Error with an error code and message.
                        } 
                    });
      
    console.log("<< DataService::deleteImage()");
  };
  
  function saveQuestions(questions) {
    console.log(">> DataService::saveQuestions() questions: " + questions);
    var jsonQuestions = JSON.stringify(questions);
    window.localStorage.setItem(QUESTION_STORAGE_KEY, jsonQuestions);      
    parseQuestions.save({questions: jsonQuestions, user_id:  userObjectId},
                        {
                        success: function(questionObject) {
                        alert("You saved your question to our Server")
                        // The object was saved successfully.
                        },
                        error: function(questionObject, error) {
                        // The save failed.
                        // error is a Parse.Error with an error code and message.
                        } 
                        });
      
    console.log("<< DataService::saveQuestions()");
  };
  
  function saveProjects(projects) {
    console.log(">> DataService::saveProjects() projects: " + projects);
    var jsonProjects = JSON.stringify(projects);
    window.localStorage.setItem(PROJECT_STORAGE_KEY, jsonProjects);
    parseProjects.save({projects: jsonProjects, user_id: userObjectId  },
                    {
                        success: function(projectObject) {
                         alert("You saved your project to our Server");
                        },
                        error: function(projectObject, error) {
                        // The save failed.
                        // error is a Parse.Error with an error code and message.
                        } 
                    });
    
  
       console.log("<< DataService::saveProjects()");
  };
  return {
    storeImage: addImage,
    removeImage: deleteImage,
    images: getImages,
    questions: getQuestions,
    storeQuestions: saveQuestions,
    projects: getProjects,
    storeProjects: saveProjects,
    projectsToPlay: getProjectsToPlay,
    questionsToPlay: getQuestionsToPlay,  
  }
})
.factory('ImageService', function($cordovaCamera, DataService, $q, $cordovaFile) {
  function makeid() {
    console.log(">> ImageService::makeid()");
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log("<< ImageService::makeid() text: " + text);
    return text;
  };
  function optionsForType(type) {
    console.log(">> ImageService::optionsForType() type: " + type);
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    console.log("<< ImageService::optionsForType()");
    return {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
  }
  function saveMedia(type) {
    console.log(">> ImageService::saveMedia() type: " + type);
    return $q(function(resolve, reject) {
      var options = optionsForType(type);
      $cordovaCamera.getPicture(options).then(function(imageUrl) {
        var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
        var newName = makeid() + name;
        $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
          .then(function(info) {
            console.log("** ImageService::saveMedia() newName: " + newName);
            DataService.storeImage(newName);
            resolve();
          }, function(e) {
            reject();
          });
      });
    })
    console.log("<< ImageService::saveMedia()");
  }
  function removeMedia(imageUrl) {
    console.log(">> ImageService::removeMedia() imageUrl: " + imageUrl);
    var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
    console.log("** ImageService::removeMedia() name: " + name);
    DataService.removeImage(name);
    $cordovaFile.removeFile(cordova.file.dataDirectory, name);
    console.log("<< ImageService::removeMedia()");
  }
  return {
    handleMediaDialog: saveMedia,
    deleteMedia: removeMedia
  }
});


