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
            "en": "langs/en.json",
            "es": "langs/es.json"
        }
    }

    $scope.formats = {
        options: ["jpeg", "png", "gif"]
    };

    $scope.imageEffects = {
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

    $scope.blurSize = "1";

    $scope.watercolorParams = {
        enabled: false,
        u: {value: 0},
        v: {value: 0}
    }

    $scope.filmParams = {
        enabled: false,
        strength: {max: 255, min: 0},
        u: {value: 0},
        v: {value: 0}
    }

    $scope.colorswapDir = "0";

    $scope.colorpointQuadrant = "1";

    $scope.posteriseSteps = {
        value: 4,
        max: 32,
        min: 2
    };

    $scope.solarizeParams = {
        yuv: "false",
        x0: {
            value: 128,
            min: 0,
            max: 255
        },
        y0: {
            value: 128,
            min: 0,
            max: 255
        },
        y1: {
            value: 128,
            min: 0,
            max: 255
        },
        y2: {
            value: 0,
            min: 0,
            max: 255
        }
    }

    $scope.colorbalanceParams = {
        lens: {
            min: 0.0,
            max: 256.0,
            step: "any"
        },
        r: {
            min: 0.0,
            max: 256.0,
            step: "any",
            value: 1.0
        },
        g: {
            min: 0.0,
            max: 256.0,
            step: "any",
            value: 1.0
        },
        b: {
            min: 0.0,
            max: 256.0,
            step: "any",
            value: 1.0
        },
        u: {
            min: 0,
            max: 255
        },
        v: {
            min: 0,
            max: 255
        }

    }

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
        $scope.imageEffects.value = config.image_effect;
        $scope.blurSize = config.blur_size.toString();
        $scope.watercolorParams.enabled = config.watercolor_params.enabled;
        $scope.watercolorParams.u.value = config.watercolor_params.u;
        $scope.watercolorParams.v.value = config.watercolor_params.v;
        $scope.filmParams.enabled = config.film_params.enabled;
        $scope.filmParams.strength.value = config.film_params.strength;
        $scope.filmParams.u.value = config.film_params.u;
        $scope.filmParams.v.value = config.film_params.v;
        $scope.colorswapDir = config.colorswap_dir.toString();
        $scope.colorpointQuadrant = config.colorpoint_quadrant.toString();
        $scope.posteriseSteps.value = config.posterise_steps;
        $scope.solarizeParams.yuv = config.solarize_params.yuv ? "true" : "false";
        $scope.solarizeParams.x0.value = config.solarize_params.x0;
        $scope.solarizeParams.y0.value = config.solarize_params.y0;
        $scope.solarizeParams.y1.value = config.solarize_params.y1;
        $scope.solarizeParams.y2.value = config.solarize_params.y2;
        $scope.colorbalanceParams.lens.value = config.colorbalance_params.lens;
        $scope.colorbalanceParams.r.value = config.colorbalance_params.r;
        $scope.colorbalanceParams.g.value = config.colorbalance_params.g;
        $scope.colorbalanceParams.b.value = config.colorbalance_params.b;
        $scope.colorbalanceParams.u.value = config.colorbalance_params.u;
        $scope.colorbalanceParams.v.value = config.colorbalance_params.v;
    }

    $scope.applyConfig = function(){
        $scope.loadingConfig = true;
        $http.post(
            "/config/apply",
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
                sharpness: $scope.sharpness.value,
                image_effect: $scope.imageEffects.value,
                blur_size: parseInt($scope.blurSize),
                watercolor_params: {
                    enabled: $scope.watercolorParams.enabled,
                    u: $scope.watercolorParams.u.value,
                    v: $scope.watercolorParams.v.value
                },
                film_params: {
                    enabled: $scope.filmParams.enabled,
                    strength: $scope.filmParams.strength.value,
                    u: $scope.filmParams.u.value,
                    v: $scope.filmParams.v.value
                },
                colorswap_dir: parseInt($scope.colorswapDir),
                colorpoint_quadrant: parseInt($scope.colorpointQuadrant),
                posterise_steps: $scope.posteriseSteps.value,
                solarize_params: {
                    yuv: $scope.solarizeParams.yuv == "true",
                    x0: $scope.solarizeParams.x0.value,
                    y0: $scope.solarizeParams.y0.value,
                    y1: $scope.solarizeParams.y1.value,
                    y2: $scope.solarizeParams.y2.value
                },
                colorbalance_params: {
                    lens: $scope.colorbalanceParams.lens.value,
                    r: $scope.colorbalanceParams.r.value,
                    g: $scope.colorbalanceParams.g.value,
                    b: $scope.colorbalanceParams.b.value,
                    u: $scope.colorbalanceParams.u.value,
                    v: $scope.colorbalanceParams.v.value,
                }
            }
        ).then(function(response){
            setConfig(response.data);
            $scope.loadingConfig = false;
            message = {
                translation: "config-applied-success",
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

app.directive("piolloUvPlanePicker",["$compile", function($compile){
    return {
        restrict: "C",
        scope: {
            model: "=piolloModel"
        },
        link: function(scope, element, attributes){
            element.addClass("grid");
            var mainContainer = angular.element("<div class='f-1-2 grid h-center'></div>");
            element.append(mainContainer);
            var planeContainer = angular.element("<div class='piollo-uv-plane-container'></div>")
            mainContainer.append(planeContainer);
            var value = angular.element("<div class='piollo-uv-value'>({{u}},&nbsp;{{v}})</div>");
            planeContainer.append(value);
            $compile(value)(scope);
            var xBar = angular.element("<div class='piollo-uv-plane-x-bar'></div>");
            planeContainer.append(xBar);
            var yBar = angular.element("<div class='piollo-uv-plane-y-bar'></div>");
            planeContainer.append(yBar);
            var plane = angular.element("<div class='piollo-uv-plane'></div>");
            planeContainer.append(plane);
            scope.u = scope.model.u.value;
            scope.v = scope.model.v.value;
            scope.model.u.max = 255;
            scope.model.v.max = 255;
            scope.model.u.min = 0;
            scope.model.v.min = 0;
            var ranges = angular.element("<div class='f-1-2 grid'></div>");
            mainContainer.after(ranges);
            var rangeU = angular.element("<div class='one-line'><span>U</span><input type='range' class='range' data-lrv-model='" + element.attr("data-piollo-model") + ".u'/></div>");
            ranges.append(rangeU);
            $compile(rangeU)(scope.$parent);
            var rangeV = angular.element("<div class='one-line'><span>V</span><input type='range' class='range' data-lrv-model='" + element.attr("data-piollo-model") + ".v'/></div>");
            ranges.append(rangeV);
            $compile(rangeV)(scope.$parent);
            var clicking = false;

            scope.$watch("model.v.value", function(){
                yBar.css({"margin-top": (255 - scope.model.v.value) + "px"});
            });

            scope.$watch("model.u.value", function(){
                xBar.css({"margin-left": scope.model.u.value + "px"});
            });

            plane.on("mousemove", function(event){
                if(clicking)
                    move(event.layerX, event.layerY);
                scope.u = event.layerX - 1;
                scope.v = 256 - event.layerY;
                scope.$apply();
                var left = event.layerX + 5;
                var top = event.layerY + 5;
                var height = value[0].offsetHeight;
                var width = value[0].offsetWidth;
                var left = left + width > 256 ? 256 - width : left;
                var top = top + height > 256 ? 256 - height : top;
                value.css({
                    "margin-left": left + "px",
                    "margin-top": top + "px"
                });
            });

            plane.on("mousedown", function(event){
                clicking = true;
                move(event.layerX, event.layerY);
            });

            plane.on("mouseup", function(event){
                clicking = false;
            });

            plane.on("mouseout", function(event){
                clicking = false;
            });

            var move = function(x, y){
                scope.model.u.value = x - 1;
                scope.model.v.value = 256 - y;
                scope.$apply();
            }
        }
    }
}]);