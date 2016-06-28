
angular.module('Piximony').factory('WebService',function($rootScope, $http, $cordovaFile, $cordovaFileOpener2) {
 
    var baseUrl = "http://piximony-dev.yaudxbzu3m.us-west-1.elasticbeanstalk.com/";
    var userToken= "";
    var currentUser = {};

    //ACCOUNT

    function create_user(username, email, password, callback){

        json =  {"username":username, "email": email, "password": password}

        var settings = {
            "url":  baseUrl + "account/register/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(json)
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("access_token")){
                callback(true,response.data)
                currentUser = response.data
            }else{
                callback(false,response)
            }
            userToken =  response.data.token
        }, function(response) {
            callback(false,response)
        });

    }

    function login(username, password, callback){

        json =  {"username":username, "password": password}

        var settings = {
            "url": baseUrl + "api-token-auth/",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "data": JSON.stringify(json)
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("token")){
                callback(true,userToken)
                userToken =  response.data.token;
                $http.defaults.headers.common.Authorization = 'Token ' + userToken
                get_current_user_info(function (result,info) {
                    if (result==true){
                        $rootScope.user = info
                        currentUser = info
                        console.log(JSON.stringify(currentUser))
                    }else{
                        alert("An error in login")
                    }
                })
            }else{
                callback(false,response)
            }

        }, function(response) {
            callback(false,JSON.stringify(response))
        });

    }

    function get_current_user_info(callback){

        var settings = {
            "url": baseUrl + 'account/api/current/',
            "method": "GET"
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("username")){
                callback(true,response.data)
                currentUser = response.data
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });

    }

    function get_user_info(username,callback){
        var settings = {
            "url": baseUrl+ "account/api/get_user/?username=testuser",
            "method": "GET"
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("username")){
                callback(true,response.data)
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    function get_all_users(callback){
        var settings = {
            "url": baseUrl + "account/api/all/",
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                callback(true,response.data)
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    /* userinfo={"city":"Austin", "gender": "male", "birthday": "02-04-1995",
                "caption": "Software Engineer", "first_name": "ekin"} */
    function edit_a_user(user_info){

        var settings = {
            "url": baseUrl+ "account/api/edit_user/",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "data":  JSON.stringify(user_info)
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("username")){
                callback(true,response.data)
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    function delete_self(){
        var settings = {
            "url": baseUrl+"account/api/delete_self/",
            "method": "POST"
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
                if (response.data.result == "success"){
                    callback(true,response.data)
                    currentUser = {};
                }else{
                    console.log(response)
                    callback(false,response.data)
                }

            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    function change_password(old_password, new_password){
        var settings = {
            "url": baseUrl + "account/api/change_password/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify({"old_password":old_password, "new_password": new_password})
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
                if (response.data.result == "success"){
                    callback(true,response.data)
                }else{
                    console.log(response)
                    callback(false,response.data)
                }

            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }
    //picture and thumbnail bytes of files
    function upload_picture_and_thumbnail(picture, thumbnail){
        form = new FormData
        form.append("picture", picture)
        form.append("thumbnail", thumbnail)

        var settings = {
            "url": baseUrl + "account/api/upload_both/",
            "method": "POST",
            "headers": {
                "authorization": "Token "+ userToken
            },
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
                if (response.data.result == "success"){
                    currentUser.picture_url = response.data.picture_url
                    currentUser.thumbnail_url = response.data.thumbnail_url
                    callback(true,response.data)
                }else{
                    console.log(response)
                    callback(false,response.data)
                }

            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }


    //PROJECT
    function create_project(project){

        var settings = {
            "url":  baseUrl + "project/api/create_project/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(project)
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("date")){
                callback(true, response.data)
            }else{
                callback(false,response.data)
            }
        }, function(response) {
            callback(false,response)
        });
    }

    function get_user_pojects(username,callback){
        var settings = {
            "url": baseUrl + "project/api/user_projects/?username=" + username,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                console.log(JSON.stringify(response))
                callback(true,response.data.results, response.data.next, response.data.previous, response.data.count)
            }else{
                console.log(response)
                callback(false,response.data,null,null,null,0)
            }
        }, function(response) {
            console.log(response)
            callback(false,response,null,null,null,0)
        });
    }

    //Question

    function create_question(question, callback){

        var form = new FormData()

        $cordovaFile.readAsArrayBuffer(cordova.file.dataDirectory, question.name)
            .then(function (success) {
                var imgBlob = new Blob([success], { type: "image/jpeg" } );
                form.append("file", imgBlob)
                form.append("title", question.title)
                form.append("options", question.options)
                form.append("correct_option", question.correct_option)
                form.append("question_id", question.question_id)
                form.append("project_id", question.project_id)

                var settings = {
                    "url":  baseUrl + "question/api/create_question/",
                    "method": "POST",
                    "headers": {
                        'Content-Type': undefined
                    },
                    "filename": question.id,
                    "processData": false,
                    "data": form
                }



                $http(settings).then(function (response) {
                    if (response.data.hasOwnProperty("date_str")) {
                        callback(true, response.data)
                        console.log("succesFull")
                    } else {
                        console.log(JSON.stringify(response.data)+"http response")
                        callback(false, response.data)
                    }
                }, function (response) {
                    console.log(JSON.stringify(response.data) + "http data" )
                    callback(false, response.data)
                });

                // success
            }, function (error) {
                callback(false,error)
                // error
            });
    }

    function update_question(question,picture, callback){
        var form = new FormData()
        form.append("question_id", question.question_id)
        form.append("title", question.title)
        form.append("options", question.options)
        form.append("correct_option", question.correct_option)

        var settings = {
            "url":  baseUrl + "question/api/edit_question/",
            "method": "POST",
            "headers": {
                'Content-Type': undefined
            },
            "filename": question.question_id,
            "processData": false,
            "data": form

        }


        if (picture != null){
            $cordovaFile.readAsArrayBuffer(cordova.file.dataDirectory, question.name)
                .then(function (success) {
                    var imgBlob = new Blob([success], {type: "image/jpeg"});
                    form.append("file", imgBlob)
                    $http(settings).then(function(response) {

                        if (response.data.hasOwnProperty("date_str")){
                            callback(true, response.data)
                        }else{
                            console.log("Im here" + response.data)
                            callback(false,response.data)
                        }
                    }, function(response) {
                        callback(false,response.data)
                        console.log(JSON.stringify(response.data))
                    });

                })
         }else{
                $http(settings).then(function(response) {

                    if (response.data.hasOwnProperty("date_str")){
                        callback(true, response.data)
                    }else{
                        console.log("Im here" + response.data)
                        callback(false,response.data)
                    }
                }, function(response) {
                    callback(false,response.data)
                    console.log(JSON.stringify(response.data))
                });

        }
    }

    function Utf8Decode(strUtf) {
        // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
        var strUni = strUtf.replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
            function (c) {  // (note parentheses for precedence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | ( c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            }
        );
        strUni = strUni.replace(
            /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
            function (c) {  // (note parentheses for precedence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            }
        );
        return strUni;

    }


    function get_questions(project_id,callback){
        var settings = {
            "url": baseUrl + "project/get_project/?project_id=" + project_id,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("questions")){
                $rootScope.$broadcast('projectQuestions',response.data.questions);

                for (var i in response.data.questions){
                    response.data.questions[i].options = response.data.questions[i].options.split(',')
                }
                console.log(JSON.stringify(response.data.questions))
                callback(true,response.data.questions)
            }else{
                console.log(response)
                callback(false,response.data)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    function readFile(fileEntry,callback) {

        // READ

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                callback(this.result)

            };

            reader.readAsText(file);

        }, onErrorReadFile);
    }

    function randomString(length) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    return {
        create_user: create_user,
        login: login,
        get_current_user_info: get_current_user_info,
        get_user_info: get_user_info,
        get_all_users: get_all_users,
        edit_a_user: edit_a_user,
        delete_self: delete_self,
        change_password: change_password,
        upload_picture_and_thumbnail: upload_picture_and_thumbnail,
        create_project: create_project,
        get_user_projects: get_user_pojects,
        create_question: create_question,
        get_questions: get_questions,
        randomString:randomString,
        update_question: update_question,
        baseUrl: baseUrl,
        userToken: userToken,
        currentUser: currentUser

    }


})