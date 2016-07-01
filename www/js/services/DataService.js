angular.module('Piximony').factory('DataService', function($rootScope) {

  var images= [];
  var questions = [];
  var projects = [];
  var playingProjects = [];

  var IMAGE_STORAGE_KEY = 'images';
  var QUESTION_STORAGE_KEY = 'questions';
  var PROJECT_STORAGE_KEY = 'projects';

    function getImages(projectID) {
      console.log(">> DataService::getImages() for projectID::" + projectID);
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY + projectID);
      if (img) {
        images = JSON.parse(img);
      }else {
        images = [];
      }
      console.log("<< DataService::getImages() length:: " + images.length);
      return images;
    };

    function addImage(img, projectID) {
      console.log(">> DataService::addImage() img: " + img);
      images.push(img);
      var jsonImages = JSON.stringify(images);
      window.localStorage.setItem(IMAGE_STORAGE_KEY + projectID, jsonImages);
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
      console.log("<< DataService::deleteImage()");
    };

    function saveQuestions(questions,projectID) {
      console.log(">> DataService::saveQuestions() questions: " + questions.length);
      var jsonQuestions = JSON.stringify(questions);
      window.localStorage.setItem(QUESTION_STORAGE_KEY + projectID, jsonQuestions);
      questions = jsonQuestions;
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

  function updateQuestion(question,projectID){

    for(var i = 0; i <  questions.length; i += 1){
      if(parseInt(questions[i].id) == parseInt(question.id)){
        break;
      }
    }

    questions[i] = question
    saveQuestions(questions,projectID);
  }
 

  return {
      storeImage: addImage,
      removeImage: deleteImage,
      storeQuestions: saveQuestions,
      storeProjects: saveProjects,
      updateQuestion: updateQuestion,
      projects: projects,
      images: images,
      questions: questions
    }

  })