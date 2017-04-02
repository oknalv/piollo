from loggersingleton import LoggerSingleton
from config import Config
import picamera
from io import BytesIO
from threading import Thread
import time
from os import path, makedirs


class CameraSingleton:
    _instance = None

    @staticmethod
    def get_instance():
        if CameraSingleton._instance is None:
            CameraSingleton._instance = CameraSingleton._CameraSingleton()

        return CameraSingleton._instance

    class _CameraSingleton:
        def __init__(self):
            self._camera = None
            self._led = True
            default_config = {
                "width": 640,
                "height": 480,
                "format": "jpeg",
                "rotation": 0,
                "hflip": False,
                "vflip": False,
                "brightness": 50,
                "contrast": 0,
                "saturation": 0,
                "sharpness": 0,
                "image_effect": "none",
                "blur_size": 1,
                "watercolor_params": {
                    "enabled": False,
                    "u": 0,
                    "v": 0
                },
                "film_params": {
                    "enabled": False,
                    "strength": 0,
                    "u": 0,
                    "v": 0
                },
                "colorswap_dir": 0,
                "colorpoint_quadrant": 1
            }
            self._config = Config("config", "current.json", "default.json", default_config)
            self._logger = LoggerSingleton.get_instance()
            self._camera_thread = None
            if not path.exists("pictures"):
                self._logger.log("Creating pictures folder")
                makedirs("pictures")

        def add_observer(self, observer):
            self._logger.log("Adding observer " + str(observer))
            if self._camera_thread is None:
                self._camera = picamera.PiCamera()
                self._load_config()
                self._camera_thread = self._CameraThread(self._camera, self._config.get("format"), self)

            self._camera_thread.add_observer(observer)

        def _load_config(self):
            self._camera.led = self._led
            self._camera.resolution = (self._config.get("width"), self._config.get("height"))
            self._camera.rotation = self._config.get("rotation")
            self._camera.hflip = self._config.get("hflip")
            self._camera.vflip = self._config.get("vflip")
            self._camera.brightness = self._config.get("brightness")
            self._camera.contrast = self._config.get("contrast")
            self._camera.saturation = self._config.get("saturation")
            self._camera.sharpness = self._config.get("sharpness")
            image_effect = self._config.get("image_effect")
            self._camera.image_effect = image_effect
            if image_effect == "blur":
                self._camera.image_effect_params = self._config.get("blur_size")

            elif image_effect == "watercolor" and self._config.get("watercolor_params")["enabled"]:
                self._camera.image_effect_params = (self._config.get("watercolor_params")["u"],
                                                    self._config.get("watercolor_params")["v"])

            elif image_effect == "film" and self._config.get("film_params")["enabled"]:
                self._camera.image_effect_params = (self._config.get("film_params")["strength"],
                                                    self._config.get("film_params")["u"],
                                                    self._config.get("film_params")["v"])

            elif image_effect == "colorswap":
                self._camera.image_effect_params = self._config.get("colorswap_dir")

            elif image_effect == "colorpoint":
                self._camera.image_effect_params = self._config.get("colorpoint_quadrant")

        def take(self):
            filename = str(int(time.time() * 1000))
            if self._camera_thread is None:
                self._camera = picamera.PiCamera()
                self._load_config()
                self._camera_thread = self._CameraThread(self._camera, self._config.get("format"), self)

            self._camera_thread.take(filename)
            while self._camera_thread.is_taking(filename):
                pass
            return filename

        def led_on(self):
            self._led = True
            if self._camera:
                self._camera.led = True

        def led_off(self):
            self._led = False
            if self._camera:
                self._camera.led = False

        def is_led_on(self):
            return self._led

        def get_config(self):
            return self._config.get_all()

        def apply_config(self, config):
            self._config.set("height", config["height"])
            self._config.set("width", config["width"])
            self._config.set("format", config["format"])
            self._config.set("rotation", config["rotation"])
            self._config.set("hflip", config["hflip"])
            self._config.set("vflip", config["vflip"])
            self._config.set("brightness", config["brightness"])
            self._config.set("contrast", config["contrast"])
            self._config.set("saturation", config["saturation"])
            self._config.set("sharpness", config["sharpness"])
            self._config.set("image_effect", config["image_effect"])
            self._config.set("blur_size", config["blur_size"])
            self._config.set("watercolor_params", {
                "enabled": config["watercolor_params"]["enabled"],
                "u": config["watercolor_params"]["u"],
                "v": config["watercolor_params"]["v"]
            })
            self._config.set("film_params", {
                "enabled": config["film_params"]["enabled"],
                "strength": config["film_params"]["strength"],
                "u": config["film_params"]["u"],
                "v": config["film_params"]["v"]
            })
            self._config.set("colorswap_dir", config["colorswap_dir"])
            self._config.set("colorpoint_quadrant", config["colorpoint_quadrant"])
            self._config.save()

        def close(self):
            self._camera_thread = None
            if self._camera is not None:
                self._camera.close()
                self._camera = None

        class _CameraThread(Thread):
            def __init__(self, camera, format_, camera_singleton):
                Thread.__init__(self)
                self._camera = camera
                self._observers = []
                self._taking = []
                self._format = format_
                self._started = False
                self._camera_singleton = camera_singleton
                self._stop = False
                self.daemon = True

            def run(self):
                self._started = True
                stream = BytesIO()
                while not self._stop:
                    if self._observers or self._taking:
                        if self._observers:
                            self._camera.capture(stream, "jpeg")
                            self.notify_observers(stream.getvalue())
                            stream.seek(0)

                        if self._taking:
                            for filename in self._taking:
                                self._camera.capture("pictures/" + filename + "." + self._format)
                                self._taking.remove(filename)

                    else:
                        break

                self._camera_singleton.close()

            def add_observer(self, observer):
                self._observers.append(observer)
                if not self._started:
                    self.start()

            def notify_observers(self, image):
                closed = []
                for observer in self._observers:
                    if observer.is_closed():
                        closed.append(observer)
                    else:
                        observer.notify(image)

                for c in closed:
                    self.delete_observer(c)

            def delete_observer(self, observer):
                self._observers.remove(observer)

            def take(self, filename):
                self._taking.append(filename)
                if not self._started:
                    self.start()

            def is_taking(self, filename):
                return filename in self._taking

            def close(self):
                self._stop = True
