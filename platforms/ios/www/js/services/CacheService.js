angular.module('Piximony').factory('CacheService', function($cordovaFile, $window, $cordovaFileTransfer) {

    var playingCache = {}
    var projectCache = {}

    var projectKeys = []
    var playingKeys = []

    var projectCache_Limit = 60
    var playingCache_Limit = 60

    var waiting_list = []
    var projectCACHE_STORAGE_KEY = "projectCache"
    var playingCACHE_STORAGE_KEY = "playingCache"

    function getCachedValue(key, isPlaying){
        console.log(">> CacheService::getCachedValue()");
        if (startsWith(key, ['http://', 'https://', 'ftp://'])) {
            cache = getCacheDict(isPlaying)
            if (cache.hasOwnProperty(key)) {
                return cordova.file.dataDirectory + cache[key]
            } else {
                addKey(key, isPlaying)
                return key
            }
        }else{
            return key
        }
        console.log("<< CacheService::getCachedValue()");
    }

    function getCacheDict(isPlaying){
        if (isPlaying){
            return playingCache
        }else{
            return projectCache
        }
    }

    function getKeyArray(isPlaying){
        if(isPlaying){
            return projectKeys
        }else{
            return playingKeys
        }
    }

    function clearCache(){
        for(key in projectCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, projectCache[key])
        }
        for (key in playingCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, playingCache[key])
        }
        projectCache = {}
        playingCache = {}
        var projectKeys = []
        var playingKeys = []
        var waiting_list = []

    }

    function addPair(key, value, isPlaying){
        console.log(">> CacheService::addPair()");
        if (key != undefined && startsWith(key, ['http://', 'https://', 'ftp://'])) {
            getCacheDict(isPlaying)[key] = value
            getKeyArray(isPlaying).unshift(key)
            storeCache(isPlaying)
            checkLimits(isPlaying)
        }
        console.log("<< CacheService::addPair()");
    }

    function getLimit(isPlaying){
        if (isPlaying){
            return playingCache_Limit
        }else{
            return projectCache_Limit
        }
    }

    function checkLimits(isPlaying){
        keys = getKeyArray(isPlaying)
        if(keys.count > getLimit(isPlaying)){
            removedKeys = keys.splice(-10)
            for (var i in removedKeys){
                removeKeyInCache(removedKeys[i], isPlaying)
            }
        }
    }
    function addKey(key, isPlaying){
        if(waiting_list.indexOf(key) < 0 ) {

            waiting_list.push(key)
            var name = randomString(16)

            $cordovaFileTransfer.download(key, cordova.file.dataDirectory + name, {}, true)
                .then(function (result) {
                    addPair(key, name, isPlaying)
                    index = waiting_list.indexOf(key)
                    if (index > -1) {
                        waiting_list.splice(index, 1);
                    }
                    console.log("result: " + JSON.stringify(result))
                }, function (err) {
                    console.log("err: " + JSON.stringify(err))
                });
        }
    }
    function removeKeyInCache(key, isPlaying){
        console.log(">> CacheService::removeKeyInCache()");
        cache = getCacheDict(isPlaying)
        $cordovaFile.removeFile(cordova.file.dataDirectory, cache[key])
        delete cache[key];
        console.log("<< CacheService::removeKeyInCache()");
    }

    function storeCache(isPlaying){
        console.log(">> CacheService::storeCache()");
        cache = getCacheDict(isPlaying)
        var jsonCache = JSON.stringify(cache);
        if (isPlaying) {
            $window.localStorage.setItem(playingCACHE_STORAGE_KEY, jsonCache);
        }else{
            $window.localStorage.setItem(projectCACHE_STORAGE_KEY, jsonCache);
        }
        console.log("<< CacheService::storeCache()");
    }

    function loadCache(isPLaying){
        console.log(">> DataService:loadCache()");
        var cache = ""
        if (isPLaying){
            cache =  $window.localStorage.getItem(playingCACHE_STORAGE_KEY);
            if (cache!== null) {
                playingCache = JSON.parse(cache)
            }
        }else{
            cache =  $window.localStorage.getItem(projectCACHE_STORAGE_KEY);
            if (cache!== null) {
                projectCache = JSON.parse(cache)
            }
        }

        console.log("<< CacheService::laodCache()");
    }

    function startsWith(str, arr) {
        if (str != undefined) {
            for (var i = 0; i < arr.length; i++) {
                var sub_str = arr[i];
                if (str.indexOf(sub_str) === 0) {
                    return true;
                }
            }
            return false;
        }else{
            return false
        }
    };

    function randomString(length) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    return {
        addPair: addPair,
        getCachedValue: getCachedValue,
        removeKeyInCache: removeKeyInCache,
        storeCache: storeCache,
        loadCache: loadCache,
        addKey: addKey,
        clearCache: clearCache
    }

})