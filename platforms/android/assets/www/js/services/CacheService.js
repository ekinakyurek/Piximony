angular.module('Piximony').factory('CacheService', function($cordovaFile, $window, $cordovaFileTransfer) {

    var playingCache = {}
    var projectCache = {}
    var playingThumbnailCache = {}
    var projectThumbnailCache = {}

    var projectKeys = []
    var playingKeys = []
    var projectThumbnailKeys = []
    var playingThumbnailKeys = []

    var projectCache_Limit = 60
    var playingCache_Limit = 60
    var projectThumbnailCache_Limit = 60
    var playingThumbnailCache_Limit = 60

    var waiting_list = []
    var projectCACHE_STORAGE_KEY = "projectCache"
    var playingCACHE_STORAGE_KEY = "playingCache"
    var projectThumbnailCACHE_STORAGE_KEY = "projectThumbnailCache"
    var playingThumbnailCACHE_STORAGE_KEY = "playingThumbnailCache"

    function getCachedValue(key, isPlaying, isThumbnail){
        console.log(">> CacheService::getCachedValue()");

        if (startsWith(key, ['http://', 'https://', 'ftp://'])) {
            cache = getCacheDict(isPlaying, isThumbnail)
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

    function getCacheDict(isPlaying, isThumbnail){

        if (isPlaying){
            if (!isThumbnail) {
                return playingCache
            }else{
                return playingThumbnailCache
            }
        }else{
            if (!isThumbnail){
                return projectCache
            }else{
                return projectThumbnailCache
            }
        }
    }

    function getKeyArray(isPlaying, isThumbnail){

        if(isPlaying){
            if (!isThumbnail) {
                return projectKeys
            }else{
                return projectThumbnailKeys
            }
        }else{
            if(!isThumbnail){
                return playingKeys
            }else{
                return playingThumbnailKeys
            }
        }
    }

    function clearCache(){

        for(key in projectCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, projectCache[key])
        }
        for(key in projectThumbnailCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, projectThumbnailCache[key])
        }
        for (key in playingCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, playingCache[key])
        }
        for (key in playingThumbnailCache){
            $cordovaFile.removeFile(cordova.file.dataDirectory, playingThumbnailCache[key])
        }

        projectCache = {}
        projectThumbnailCache = {}
        playingCache = {}
        playingThumbnailCache = {}

        projectKeys = []
        projectThumbnailKeys = []
        playingKeys = []
        playingThumbnailKeys = []
        waiting_list = []

    }

    function addPair(key, value, isPlaying, isThumbnail){
        console.log(">> CacheService::addPair()");

        if (key != undefined && startsWith(key, ['http://', 'https://', 'ftp://'])) {
            getCacheDict(isPlaying,isThumbnail)[key] = value
            getKeyArray(isPlaying,isThumbnail).unshift(key)
            storeCache(isPlaying,isThumbnail)
            checkLimits(isPlaying,isThumbnail)
        }
        console.log("<< CacheService::addPair()");
    }

    function getLimit(isPlaying, isThumbnail){

        if (isPlaying){
            if(!isThumbnail) {
                return playingCache_Limit
            }else{
                return playingThumbnailCache_Limit
            }
        }else{
            if(!isThumbnail) {
                return projectCache_Limit
            }else{
                return projectThumbnailCache_Limit
            }
        }
    }

    function checkLimits(isPlaying, isThumbnail){
        keys = getKeyArray(isPlaying, isThumbnail)

        if(keys.count > getLimit(isPlaying, isThumbnail)){
            removedKeys = keys.splice(-10)
            for (var i in removedKeys){
                removeKeyInCache(removedKeys[i], isPlaying, isThumbnail)
            }
        }
    }
    function addKey(key, isPlaying, isThumbnail){

        if(waiting_list.indexOf(key) < 0 ) {

            waiting_list.push(key)
            var name = randomString(16)

            $cordovaFileTransfer.download(key, cordova.file.dataDirectory + name, {}, true)
                .then(function (result) {
                    addPair(key, name, isPlaying, isThumbnail)
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
    function removeKeyInCache(key, isPlaying, isThumbnail){
        console.log(">> CacheService::removeKeyInCache()");
        cache = getCacheDict(isPlaying, isThumbnail)
        $cordovaFile.removeFile(cordova.file.dataDirectory, cache[key])
        delete cache[key];
        console.log("<< CacheService::removeKeyInCache()");
    }

    function storeCache(isPlaying, isThumbnail){
        console.log(">> CacheService::storeCache()");
        cache = getCacheDict(isPlaying, isThumbnail)
        var jsonCache = JSON.stringify(cache);

        if (isPlaying) {
            if(!isThumbnail) {
                $window.localStorage.setItem(playingCACHE_STORAGE_KEY, jsonCache);
            }else{
                $window.localStorage.setItem(playingThumbnailCACHE_STORAGE_KEY, jsonCache);
            }
        }else{
            if(!isThumbnail){
                $window.localStorage.setItem(projectCACHE_STORAGE_KEY, jsonCache);
            }else{
                $window.localStorage.setItem(projectThumbnailCACHE_STORAGE_KEY, jsonCache);
            }
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

            thumbnailCache = $window.localStorage.getItem(playingThumbnailCACHE_STORAGE_KEY);
            if (thumbnailCache!== null) {
                playingThumbnailCache = JSON.parse(thumbnailCache)
            }

        }else{
            cache =  $window.localStorage.getItem(projectCACHE_STORAGE_KEY);
            if (cache!== null) {
                projectCache = JSON.parse(cache)
            }

            thumbnailCache = $window.localStorage.getItem(projectThumbnailCACHE_STORAGE_KEY);
            if (thumbnailCache!== null) {
                projectThumbnailCache = JSON.parse(thumbnailCache)
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