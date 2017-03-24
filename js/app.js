var app = angular.module("piolloApp", ["larvae"]);

app.controller("piolloController",["$scope", "$location", "$http", "lrvColor", "lrvElement", function($scope, $location, $http, lrvColor, lrvElement){
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
    $scope.loadingConfig = true;

    $scope.rotation = 0;

    $scope.hflip = false;
    $scope.vflip = false;

    lrvColor.setDefaultColors({
        "btn": ["#000000", "transparent"]
    })
    lrvColor.addColor("btn", "red", ["#FF0000", "transparent"]);
    lrvColor.addColor("message", "success", ["#00FFAA", "#FFFFFF"])

    $scope.langs = {
        value: "en",
        defaultLanguage: "en",
        options: [
            {
                value: "en",
                text: "English"
            },
            {
                value: "es",
                text: "español"
            }
        ],
        texts: {
            "en": texts["en"],
            "es": texts["es"]
        }
    }

    $scope.formats = {
        options: ["jpeg", "png", "gif"]
    };

    $scope.effects = {
        value: "none",
        options: [
            {value: "none", translation: "none"},
            {value: "negative", translation: "negative"},
            {value: "solarize", translation: "solarize"},
            {value: "sketch", translation: "sketch"},
            {value: "denoise", translation: "denoise"},
            {value: "emboss", translation: "emboss"},
            {value: "oilpaint", translation: "oilpaint"},
            {value: "gpen", translation: "gpen"},
            {value: "hatch", translation: "hatch"},
            {value: "pastel", translation: "pastel"},
            {value: "watercolor", translation: "watercolor"},
            {value: "film", translation: "film"},
            {value: "blur", translation: "blur"},
            {value: "saturation", translation: "saturation"},
            {value: "colorswap", translation: "colorswap"},
            {value: "washedout", translation: "washedout"},
            {value: "posterise", translation: "posterise"},
            {value: "colorpoint", translation: "colorpoint"},
            {value: "colorbalance", translation: "colorbalance"},
            {value: "cartoon", translation: "cartoon"},
            {value: "deinterlace1", translation: "deinterlace1"},
            {value: "deinterlace2", translation: "deinterlace2"}
        ]
    };

    $scope.width = {
        max: 1920,
        min: 640
    };

    $scope.height = {
        max: 1080,
        min: 480
    };

    $scope.brightness = {
        max: 100,
        min: 0
    };

    $scope.contrast = {
        max: 100,
        min: -100
    };

    $scope.saturation = {
        max: 100,
        min: -100
    };

    $scope.sharpness = {
        max: 100,
        min: -100
    };

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

    $scope.rotate = function(clock){
        if(clock){
            var rotation = $scope.rotation + 90;
            if(rotation == 360)
                rotation = 0;
            $scope.rotation = rotation;
        }
        else{
            var rotation = $scope.rotation - 90;
            if(rotation == -90)
                rotation = 270;
            $scope.rotation = rotation;

        }
    }

    $scope.flip = function(vertical){
        if(vertical)
            $scope.vflip = !$scope.vflip;
        else
            $scope.hflip = !$scope.hflip;
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

    function getAbout(){
        about = window.localStorage.getItem("about") == "true";
        return about != null && about;
    }

    function loadConfig(){
        $scope.loadingConfig = true;
        $http.get("/config").then(function(response){
            setConfig(response.data);
            $scope.loadingConfig = false;
        });
    }

    function setConfig(config){
        $scope.width.value = config.width;
        $scope.height.value = config.height;
        $scope.formats.value = config.format;
        $scope.rotation = config.rotation;
        $scope.hflip = config.hflip;
        $scope.vflip = config.vflip;
        $scope.brightness.value = config.brightness;
        $scope.contrast.value = config.contrast;
        $scope.saturation.value = config.saturation;
        $scope.sharpness.value = config.sharpness;
    }

    $scope.saveConfig = function(){
        $scope.loadingConfig = true;
        $http.post(
            "/config",
            {
                width: $scope.width.value,
                height: $scope.height.value,
                format: $scope.formats.value,
                rotation: $scope.rotation,
                hflip: $scope.hflip,
                vflip: $scope.vflip,
                brightness: $scope.brightness.value,
                contrast: $scope.contrast.value,
                saturation: $scope.saturation.value,
                sharpness: $scope.sharpness.value
            }
        ).then(function(response){
            setConfig(response.data);
            $scope.loadingConfig = false;
            message = {
                translation: "config-saved-success",
                time: 3000,
                classes: "success"
            };
            lrvElement.message("configMessage").add(message);
        });
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
    loadConfig();
}]);