
angular.module('Piximony').factory('WebService',function($http, $cordovaFile) {

    var baseUrl = "http://piximony-dev.yaudxbzu3m.us-west-1.elasticbeanstalk.com/";
    //baseUrl = "http://127.0.0.1:8000/"
    var userToken= "";

    function set_token(token){
        console.log(token)
        userToken = token ;
        $http.defaults.headers.common.Authorization = 'Token ' + userToken;
    }
    //ACCOUNT

    function create_user(newuser, callback){

        var settings = {
            "url":  baseUrl + "account/register/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(newuser)
        }

        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("access_token")){
                set_token(response.data.access_token)
                callback(true,response.data)

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
                set_token(response.data.token)
                get_current_user_info(function (result,info) {
                    if (result==true){
                        callback(true,info)
                    }else{
                        callback(false,info)
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
                response.data.access_token =  userToken
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

    function get_user_info(username,callback){
        var settings = {
            "url": baseUrl+ "account/api/get_user/?username=" + username,
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
                callback(true,response.data.results)
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
    function upload_picture_data(picture, currentUser, callback){
        var form = new FormData()

        $cordovaFile.readAsArrayBuffer(cordova.file.dataDirectory, picture)
            .then(function (success) {
                console.log("pictureeee")
                var imgBlob = new Blob([success], { type: "image/jpeg" } );
                form.append("picture", imgBlob)
                form.append('user', JSON.stringify(currentUser))
                
                var settings = {
                    "url": baseUrl + "account/api/upload_picture_data/",
                    "method": "POST",
                    "headers": {
                        'Content-Type': undefined
                    },
                    "filename": currentUser.username,
                    "processData": false,
                    "data": form
                }

                return $http(settings).then(function(response) {
                    if (response.data.hasOwnProperty("username")){
                        if (response.data.result == "success"){
                            callback(true, response.data)
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
            })




    }

    function get_friends(project_id, callback){
        var settings = {
            "url": baseUrl + "account/api/share_friends/?project_id=" + project_id,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                callback(true,response.data.results)
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }


    function get_requests(username, callback){
        var settings = {
            "url": baseUrl + "account/api/get_requests/?username=" + username,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                callback(true,response.data.results)
            }else{
                console.log(response)
                callback(false,response)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }


    function accept_friendship(username, callback){
        var settings = {
            "url": baseUrl + "account/api/accept_friendship/?username=" + username,
            "method": "POST"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
            }else{
                console.log(response)
                callback(false)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }

    function request_friendship(username, callback){
        var settings = {
            "url": baseUrl + "account/api/request_friendship/?username=" + username,
            "method": "POST"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
                console.log(JSON.stringify(response))
                callback(response.data.result=="success")
            }else{
                console.log(response)
                callback(false)
            }
        }, function(response) {
            console.log(response)
            callback(false,response)
        });
    }


    //PROJECT
    function create_project(project,callback){

        var settings = {
            "url":  baseUrl + "project/api/create_project/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(project)
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("date_str")){
                callback(true, response.data)
            }else{
                console.log(JSON.stringify(response))
                callback(false,response.data)
            }
        }, function(response) {
            callback(false,response)
            console.log(JSON.stringify(response))
        });
    }

    function get_user_pojects(username, callback){
        var settings = {
            "url":  baseUrl + "project/api/user_projects/?username=" + username,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                console.log(JSON.stringify(response.data.results))
                callback(true,response.data.results, response.data.next, response.data.previous, response.data.count)
            }else{
                console.log(JSON.stringify(response))
                callback(false,response.data,null,null,null,0)
            }
        }, function(response) {
            console.log(JSON.stringify(response))
            callback(false,response,null,null,null,0)
        });
    }

    function get_playing_pojects(username, callback){
        var settings = {
            "url": baseUrl  + "project/api/playing_projects/?username=" + username,
            "method": "GET"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("count")){
                callback(true,response.data.results, response.data.next, response.data.previous, response.data.count)
            }else{
                console.log(JSON.stringify(response))
                callback(false,response.data,null,null,null,0)
            }
        }, function(response) {
            console.log(JSON.stringify(response))
            callback(false,response,null,null,null,0)
        });
    }

    function share_project(project_id, shared_users, callback){

        json = {"users": shared_users}
        console.log(json)
        var settings = {
            "url":  baseUrl  + "project/api/share_project/?project_id=" + project_id,
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(json)
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
                console.log(JSON.stringify(response))
            }else{
                callback(false,JSON.stringify(response.data))
                console.log(JSON.stringify(response))
            }
        }, function(response) {
            callback(false,JSON.stringify(response))
            console.log(JSON.stringify(response))
        });
    }


    function withdraw_project(project_id, callback){

        var settings = {
            "url":  baseUrl  + "project/api/withdraw_project/?project_id=" + project_id,
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": ""
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
                console.log(JSON.stringify(response))
            }else{
                callback(false,JSON.stringify(response.data))
                console.log(JSON.stringify(response))
            }
        }, function(response) {
            callback(false,JSON.stringify(response))
            console.log(JSON.stringify(response))
        });
    }

    function delete_project(project_id, callback){

        var settings = {
            "url":  baseUrl  + "project/delete_project/?project_id=" + project_id,
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": ""
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
                console.log(JSON.stringify(response))
            }else{
                callback(false,JSON.stringify(response.data))
                console.log(JSON.stringify(response))
            }
        }, function(response) {
            callback(false,JSON.stringify(response))
            console.log(JSON.stringify(response))
        });
    }

    function publish_project(project_id, callback){

        var settings = {
            "url":  baseUrl  + "project/api/publish_project/?project_id=" + project_id,
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": ""
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
                console.log(JSON.stringify(response))
            }else{
                callback(false,JSON.stringify(response.data))
                console.log(JSON.stringify(response))
            }
        }, function(response) {
            callback(false,JSON.stringify(response))
            console.log(JSON.stringify(response))
        });
    }



    //Question

    function create_question(question, callback){
        console.log(JSON.stringify(question))

        var form = new FormData()

        $cordovaFile.readAsArrayBuffer(cordova.file.dataDirectory, question.name)
            .then(function (success) {
                var imgBlob = new Blob([success], { type: "image/jpeg" } );
                form.append("file", imgBlob)
                form.append("info", JSON.stringify(question))


                var settings = {
                    "url": baseUrl + "question/api/create_question/",
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
                        console.log("Question Created Succesfully")
                    } else {
                        console.log(JSON.stringify(response.data))
                        callback(false, response.data)
                    }
                }, function (response) {
                    console.log(JSON.stringify(response))
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
        form.append("info", JSON.stringify(question))

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

    function delete_question(question_id,callback){
        var settings = {
            "url": baseUrl + "question/delete_question/?question_id=" + question_id,
            "method": "POST"
        }
        return $http(settings).then(function(response) {
            if (response.data.hasOwnProperty("result")){
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

    //score_board

    function update_score(scoreboard, callback){

        var settings = {
            "url":  baseUrl  + "scoreboard/api/update_score/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(scoreboard)
        }

        $http(settings).then(function(response) {

            if (response.data.hasOwnProperty("result")){
                callback(response.data.result=="success")
                console.log(JSON.stringify(response))
            }else{
                callback(false,JSON.stringify(response.data))
                console.log(JSON.stringify(response))
            }
        }, function(response) {
            callback(false,JSON.stringify(response))
            console.log(JSON.stringify(response))
        });
    }

    function randomString(length) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    return {
        set_token: set_token,
        create_user: create_user,
        login: login,
        get_current_user_info: get_current_user_info,
        get_user_info: get_user_info,
        get_all_users: get_all_users,
        edit_a_user: edit_a_user,
        delete_self: delete_self,
        change_password: change_password,
        upload_picture_data: upload_picture_data,
        create_project: create_project,
        get_user_projects: get_user_pojects,
        get_playing_projects: get_playing_pojects,
        create_question: create_question,
        get_questions: get_questions,
        delete_question:delete_question,
        randomString:randomString,
        update_question: update_question,
        get_friends: get_friends,
        get_requests: get_requests,
        request_friendship: request_friendship,
        accept_friendship: accept_friendship,
        share_project: share_project,
        update_score: update_score,
        withdraw_project: withdraw_project,
        publish_project: publish_project,
        delete_project: delete_project,
        userToken: userToken

    }


})