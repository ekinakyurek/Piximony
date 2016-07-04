angular.module('Piximony').factory('DataService', function() {

  var images= [];
  
  var questions = [];
  var projects = [];
  var projectsToPlay = [];

  currentUser = null;

  var IMAGE_STORAGE_KEY = 'images';
  //var QUESTION_STORAGE_KEY = 'questions';
  var PROJECT_STORAGE_KEY = 'projects';
  var projectToPlay_STORAGE_KEY = 'projectsToPlay';
  var USER_STORAGE_KEY = 'user';

  function saveUser(user){
    console.log(">> DataService::saveUser()");
    currentUser = user
    console.log("save user:" + JSON.stringify(user))
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    console.log("<< DataService::saveUser()");
  }

  function getUser(){
    console.log(">> DataService::getUser()");
    if( currentUser === null ){
      var user = window.localStorage.getItem(USER_STORAGE_KEY)
      if(user !== null){
        currentUser =  JSON.parse(user)
        console.log("get User: " + currentUser.username+JSON.stringify(currentUser))
      }
    }
    console.log("<< DataService::getUser() = "+ currentUser);
    return currentUser
  }

  function clearStorage(){
    console.log("clear user")
    window.localStorage.clear();
    currentUser = null
  }

  function getImages(projectID) {
    console.log(">> DataService::getImages() for projectID::" + projectID);
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY + projectID);
    if (img !== null) {
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

  function storeQuestion(question,projectID){
    console.log(">> DataService::saveQuestion() question: " + question.title);
    project_index = projects.map(function(e) { return e.project_id; }).indexOf(projectID);

    if (project_index != -1) {
      question_index = projects[project_index].questions.map(function(e) { return e.question_id; }).indexOf(question.question_id);
      if (question_index != -1) {
        projects[project_index].questions[question_index] = question
      }else{
        projects[project_index].questions.unshift(question)
      }
      storeProjects(projects)
    }else{
      alert("Error in DataService::saveQuestion()")
    }
    console.log("<< DataService::updateQuestion()");
  }

  function storeQuestions(questions,projectID) {
    console.log(">> DataService::storeQuestions() questions: " + questions.length);
    questions = questions
    project_index = projects.map(function(e) { return e.project_id; }).indexOf(projectID);
    if (project_index != -1){
      projects[project_index].questions = questions
      storeProjects(projects)
    }else{
      alert("Error in DataService::storeQuestions()")
    }
    console.log("<< DataService::storeQuestions()");
  };

  function storeProject(project){
    console.log(">> DataService::updateProject() " + project.title );
    project_index = projects.map(function(e) { return e.project_id; }).indexOf(project.project_id);
    if (project_index != -1){
      projects[project_index] = project
    }else{
      projects.unshift(project)
    }
    storeProjects(projects)
    console.log("<< DataService::updateProject() ");
  }

  function storeProjects(Projects) {
    console.log(">> DataService::storeProjects()");
    projects = Projects;
    var jsonProjects = JSON.stringify(projects);
    window.localStorage.setItem(PROJECT_STORAGE_KEY, jsonProjects);
    console.log("<< DataService::storeProjects()");
  };

  function getProjects(){
    console.log(">> DataService::getProjects()");
    var local_projects =  window.localStorage.getItem(PROJECT_STORAGE_KEY);
    if (local_projects!== null) {
      projects = JSON.parse(local_projects)
    }
    console.log("<< DataService::getProjects()")
    return projects

  }

  function getQuestions(projectID){
    console.log(">> DataService::getQustions()");
    project_index = projects.map(function(e) { return e.project_id; }).indexOf(projectID);
    if (project_index != -1){
       questions = projects[project_index].questions
    }else{
      alert("Error in DataService::storeQuestions")
    }
    console.log("<< DataService::getQustions()");
    return questions
  }

  function storeProjectsToPlay(Projects) {
    console.log(">> DataService::storeProjectsToPlay()");
    projectsToPlay = Projects;
    var jsonProjects = JSON.stringify(projectsToPlay);
    window.localStorage.setItem(projectToPlay_STORAGE_KEY, jsonProjects);
    console.log("<< DataService::storeProjectsToPlay()");
  };

  function getProjectsToPlay() {
    console.log(">> DataService:getProjectsToPlay()");
    var local_projects =  window.localStorage.getItem(projectToPlay_STORAGE_KEY);
    if (local_projects!== null) {
      projectsToPlay = JSON.parse(local_projects)
    }
    console.log("<< DataService::storeProjectsToPlay()");
    return projectsToPlay
  };


  return {
    saveUser: saveUser,
    clearStorage: clearStorage,
    getUser: getUser,
    storeImage: addImage,
    removeImage: deleteImage,
    storeQuestions: storeQuestions,
    storeProjects: storeProjects,
    storeProject: storeProject,
    storeQuestion: storeQuestion,
    storeProjectsToPlay: storeProjectsToPlay ,
    getProjects: getProjects,
    getQuestions: getQuestions,
    getProjectsToPlay: getProjectsToPlay,
    images: images,
    USER_STORAGE_KEY: USER_STORAGE_KEY
  }

  })