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
    function saveMedia(type,callback) {
        console.log(">> ImageService::saveMedia() type: " + type);

        var options = optionsForType(type);

        navigator.camera.getPicture(function camera_success(imageUrl){
            console.log(imageUrl)
            var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
            var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
                .then(function(info) {
                    console.log("** ImageService::saveMedia() newName: " + newName);
                    // DataService.storeImage(cordova.file.dataDirectory+newName,projectID);
                    console.log("ImageService::saveMedia()->uploadPicture()");
                    callback(true, newName);
                }, function(error) {
                    alert("saveMedia() error::" + error.message) ;
                    callback(false, error);
                });
        }, function camera_error(error){
            console.log("Error in ImageService:: SaveMedia:" + error)
        }, options)

        console.log("<< ImageService::saveMedia()");
    };



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
      downloadImage : downloadImage,
      isInProgress : isInProgress
    }
  });
