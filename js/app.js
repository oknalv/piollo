var app = angular.module("piolloApp", ["larvae-directive"]);

app.controller("piolloController",["$scope", "$location", "$http", function($scope, $location, $http){
    var methods = {}
    var wsurl = "ws://" + $location.host() + ":" + $location.port() + "/streaming";
    var datastream = null;

    $scope.streaming = false;
    $scope.loading = false;
    $scope.streamingControlsVisible = false;
    $scope.taking = false;
    $scope.ledOn = false;
    $scope.pictures = [];
    $scope.aboutPage = getAbout();

    $scope.langs = Object.keys(texts);
    $scope.texts = texts;
    $scope.defaultLang = "English";
    $scope.selectedLang = getLang();

    $scope.formats = [
        "tiff",
        {
            value: "jpeg",
            text: "jpeg"
        },
        {
            value: "png",
            selected: true
        },
        "jpg"
    ];
    $scope.format = "png";

    $scope.effects = [
        {
            value: "none",
            translation: "none",
            selected: true
        },
        {
            value: "negative",
            translation: "negative"
        },
        {
            value: "solarize",
            translation: "solarize"
        },
        {
            value: "sketch",
            translation: "sketch"
        },
        {
            value: "denoise",
            translation: "denoise"
        },
        {
            value: "emboss",
            translation: "emboss"
        },
        {
            value: "oilpaint",
            translation: "oilpaint"
        },
        {
            value: "gpen",
            translation: "gpen"
        },
        {
            value: "hatch",
            translation: "hatch"
        },
        {
            value: "pastel",
            translation: "pastel"
        },
        {
            value: "watercolor",
            translation: "watercolor"
        },
        {
            value: "film",
            translation: "film"
        },
        {
            value: "blur",
            translation: "blur"
        },
        {
            value: "saturation",
            translation: "saturation"
        },
        {
            value: "colorswap",
            translation: "colorswap"
        },
        {
            value: "washedout",
            translation: "washedout"
        },
        {
            value: "posterise",
            translation: "posterise"
        },
        {
            value: "colorpoint",
            translation: "colorpoint"
        },
        {
            value: "colorbalance",
            translation: "colorbalance"
        },
        {
            value: "cartoon",
            translation: "cartoon"
        },
        {
            value: "deinterlace1",
            translation: "deinterlace1"
        },
        {
            value: "deinterlace2",
            translation: "deinterlace2"
        }
    ];

    $scope.imageWidth = 0;

    $scope.startStreaming = function(){
        if(datastream == null){
            $scope.loading = true;
            datastream = new WebSocket(wsurl);

            datastream.onopen = function(){
                $scope.streaming = true;
                $scope.$apply();
                isLedOn();
            }

            datastream.onmessage = function(message){
                if($scope.loading){
                    $scope.loading = false;
                    $scope.$apply();
                }
                var reader = new window.FileReader();
                reader.readAsDataURL(message.data);
                reader.onloadend = function(){
                    setImage(this.result);
                };
            }

            datastream.onclose = function(){
                $scope.streaming = false;
                $scope.loading = false;
                $scope.$apply();
                datastream = null;
            }
        }

    }

    $scope.stopStreaming = function(){
        if(datastream != null)
            datastream.close();
        disableFullScreen();
    }

    $scope.fullScreen = function(){
        if(!isFullScreen()){
            enableFullScreen();
        }
        else{
            disableFullScreen();
        }
    }

    $scope.takePicture = function(){
        $scope.taking = true;
        $http.get("/take").then(function(response){
            document.getElementById("pic").src = "pictures/" + response.data.image;
        }, function(response){
            console.log("fail: " + response.data)
        }).finally(function(){
            $scope.taking = false;
            showGallery();
        });
    }

    $scope.turnOnLed = function(){
        $http.get("/led?on=true").then(function(response){
            $scope.ledOn = response.data.led;
        });
    }

    $scope.turnOffLed = function(){
        $http.get("/led?on=false").then(function(response){
            $scope.ledOn = response.data.led;
        });
    }

    $scope.showImage = function(image){
        console.log(image);
    }

    function setImage(image){
        document.getElementById("video").src = image;
    }

    function isLedOn(){
        $http.get("/led").then(function(response){
            $scope.ledOn = response.data.led;
        });
    }

    function showGallery(){
        $http.get("/gallery").then(function(response){
            $scope.pictures = response.data;
        });
    }

    function enableFullScreen(){
        document.getElementById("video-container").mozRequestFullScreen();
    }

    function disableFullScreen(){
        document.mozCancelFullScreen();
    }

    function isFullScreen(){
        return (document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement) != null;
    }

    function getLang(){
        lang = window.localStorage.getItem("lang");
        if(lang != null && $scope.langs.indexOf(lang) != -1)
            return lang;
        return $scope.defaultLang;
    }

    function getAbout(){
        about = window.localStorage.getItem("about") == "true";
        return about != null && about;
    }

    document.addEventListener("mozfullscreenchange", function(event){
        if(isFullScreen()){
            document.getElementById("video").classList.remove("piollo-video");
            document.getElementById("video").classList.add("piollo-fullscreen");
            document.getElementById("video-parent").classList.add("piollo-fullscreen");
        }
        else{
            document.getElementById("video-parent").classList.remove("piollo-fullscreen");
            document.getElementById("video").classList.remove("piollo-fullscreen");
            document.getElementById("video").classList.add("piollo-video");
        }
    });

    $scope.$watch("aboutPage", function(){
        window.localStorage.setItem("about", $scope.aboutPage);
    });

    isLedOn();
    showGallery();
}]);