angular.module('Piximony').factory('ImageService', function($cordovaCamera, DataService, $q, $cordovaFile, $cordovaFileTransfer) {

    var inProgress = false ;
    var options = new FileUploadOptions();

    var headers={'X-Parse-Application-Id':'iZdpAD7vYS44lPB2qLDedAsl8Fn5XUwtNkHJjYN4',
    'X-Parse-REST-API-Key':'A74NTKD0VcG6MimypvHfo9ru1K4rrDRRTItgceSJ',
    'Content-Type':'image/jpeg'};
    options.headers = headers;

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
        quality: 75,
          targetWidth : 1080,
          targetHeight: 1080,
        //allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
    }
    function saveMedia(type,projectID,questionID) {
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
                        DataService.storeImage(cordova.file.dataDirectory+newName,projectID);
                        console.log("ImageService::saveMedia()->uploadPicture()");
                        resolve(newName);
                    }, function(error) {
                        alert("saveMedia() error::" + error.message) ;
                        reject();
                    });
        });
      })
      console.log("<< ImageService::saveMedia()");
    };

    function resizeImage(longSideMax, url, callback) {
        console.log(">> ImageService::resizeImage()");
        var tempImg = new Image();
        tempImg.src = url;
        tempImg.onload = function() {
            // Get image size and aspect ratio.
            console.log("on load");
            var targetWidth = tempImg.width;
            var targetHeight = tempImg.height;
            var aspect = tempImg.width / tempImg.height;

            // Calculate shorter side length, keeping aspect ratio on image.
            // If source image size is less than given longSideMax, then it need to be
            // considered instead.
            if (tempImg.width > tempImg.height) {
                longSideMax = Math.min(tempImg.width, longSideMax);
                targetWidth = longSideMax;
                targetHeight = longSideMax / aspect;
            }
            else {
                longSideMax = Math.min(tempImg.height, longSideMax);
                targetHeight = longSideMax;
                targetWidth = longSideMax * aspect;
            }

            // Create canvas of required size.
            var canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            var ctx = canvas.getContext("2d");
            // Take image from top left corner to bottom right corner and draw the image
            // on canvas to completely fill into.
            ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);
            console.log("<< ImageService::resizeImage()");
            window.canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg){
                    console.log(msg);
                    callback("file:///" +msg);
                    console.log(msg)
                },
                function(err){
                    console.log(err);
                },
                canvas
            );

        };
    }

    function uploadPictureToParse(path,name, projectID,questionID){

      console.log(">> ImageService::uploadPicture()");
      // var server = 'https://api.parse.com/1/files/' + name;
      //
      // //console.log(server + " " + path +  " " +  options)
      //
      // $cordovaFileTransfer.upload(server, path , options)
      // .then(function(result) {
      //   DataService.storeImage(result.headers.Location,projectID);
      //
      //   var questions = DataService.globalquestions();
      //   var projects = DataService.globalprojects();
      //
      //   for(var i = 0; i <  questions.length; i += 1){
      //       if(parseInt(questions[i].id) == parseInt(questionID)){
      //         break;
      //       }
      //   }
      //
      //     questions[i].remote = result.headers.Location
      //
      //
      //   for(var j = 0; j <  projects.length; j += 1){
      //       if(projects[j].id == projectID){
      //
      //         projects[j].remote = result.headers.Location
      //         DataService.updateProject(projects[j],projects[j].id);
      //         break;
      //       }
      //   }
      //
      //
      //
      //     DataService.storeProjects(projects);
      //     DataService.storeQuestions(questions,projectID);
      //
      //     console.log("uploadPicture() success" + result.headers.Location );
      //
      // },function(error) {
      //   alert("uploadPicture() error::" + error.message) ;
      //
      // }, function (progress) {
      //   // constant progress updates
      // });
      console.log("<< ImageService::uploadPicture()");
    }

    function removeMedia(imageUrl,projectID) {
      console.log(">> ImageService::removeMedia() imageUrl: " + imageUrl);
      var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
      console.log("** ImageService::removeMedia() name: " + name);
      DataService.removeImage(name,projectID);
      $cordovaFile.removeFile(cordova.file.dataDirectory, name);
      console.log("<< ImageService::removeMedia()");
    }

    function isInProgress () {
        return inProgress
    }

    function downloadImage(question) {
    inProgress = true;
    var url = question.remote;
    var targetPath = question.name;
    var trustHosts = true;
    var options = {};

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        console.log('download succesfull')
        inProgress = false;
      }, function(err) {
        // Error
         inProgress = false;
      }, function (progress) {
        //
      });

   }
    return {
      handleMediaDialog: saveMedia,
      deleteMedia: removeMedia,
      uploadPictureToParse :  uploadPictureToParse,
      downloadImage : downloadImage,
      isInProgress : isInProgress
    }
  });
