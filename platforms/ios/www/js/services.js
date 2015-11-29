angular.module('Piximony')

.factory('FileService', function() {

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
    console.log(">> FileService::getImages()");
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
    console.log("<< FileService::getImages() images: (" + images + ")" );
    return images;
  };
 
  function getQuestions() {
    console.log(">> FileService::getQuestions()");
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
    console.log("<< FileService::getQuestions() questions: (" + questions + ")" );
    return questions;
  };
  
  function getProjects() {
    console.log(">> FileService::getProjects()");
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
    console.log("<< FileService::getProjects() projects: (" + projects + ")" );
    return projects;
  };
  
  function addImage(img) {
    console.log(">> FileService::addImage() img: " + img);
    images.push(img);
    console.log("** FileService::addImage() images: " + images);
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
    console.log("<< FileService::addImage()");
  };
 
  function deleteImage(img) {
    console.log(">> FileService::deleteImage() img: " + img);
    var index = images.indexOf(img);
    if(index > -1) {
        images.splice(index, 1);
    }
    var jsonImages = JSON.stringify(images);
    console.log("** FileService::deleteImage() images: " + images);
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
      
    console.log("<< FileService::deleteImage()");
  };
  
  function saveQuestions(questions) {
    console.log(">> FileService::saveQuestions() questions: " + questions);
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
      
    console.log("<< FileService::saveQuestions()");
  };
  
  function saveProjects(projects) {
    console.log(">> FileService::saveProjects() projects: " + projects);
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
    
  
       console.log("<< FileService::saveProjects()");
  };
  return {
    storeImage: addImage,
    removeImage: deleteImage,
    images: getImages,
    questions: getQuestions,
    storeQuestions: saveQuestions,
    projects: getProjects,
    storeProjects: saveProjects
  }
})
.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
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
            FileService.storeImage(newName);
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
    FileService.removeImage(name);
    $cordovaFile.removeFile(cordova.file.dataDirectory, name);
    console.log("<< ImageService::removeMedia()");
  }
  return {
    handleMediaDialog: saveMedia,
    deleteMedia: removeMedia
  }
});


