from loggersingleton import LoggerSingleton
from config import Config
import picamera
from io import BytesIO
from threading import Thread
import time
from PIL import Image


class CameraSingleton:
    _instance = None

    @staticmethod
    def get_instance():
        if CameraSingleton._instance is None:
            CameraSingleton._instance = CameraSingleton._CameraSingleton()
            CameraSingleton._instance.daemon = True

        return CameraSingleton._instance

    class _CameraSingleton(Thread):
        def __init__(self):
            Thread.__init__(self)
            self._closed = False
            self._observers = []
            self._camera = None
            self._taking = []
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
                "sharpness": 0
            }
            self._config = Config("config", "current.json", "default.json", default_config)
            self._logger = LoggerSingleton.get_instance()

        def add_observer(self, observer):
            self._logger.log("Adding observer " + str(observer))
            self._observers.append(observer)

        def notify_observers(self, image):
            closed = []
            for observer in self._observers:
                if observer.is_closed():
                    closed.append(observer)
                else:
                    observer.notify(image)

            for c in closed:
                self.delete_observer(c)

        def run(self):
            stream = BytesIO()
            while True:
                if self._observers or self._taking:
                    self.open_camera()

                    if self._camera:
                        self._camera.capture(stream, "jpeg")
                        self.notify_observers(stream.getvalue())
                        stream.seek(0)

                    if self._taking:
                        for filename in self._taking:
                            self._camera.capture("pictures/" + filename + "." + self._config.get("format"))
                            self._taking.remove(filename)

                else:
                    self.close_camera()

        def delete_observer(self, observer):
            self._logger.log("Deleting observer " + str(observer))
            self._observers.remove(observer)

        def open_camera(self):
            if self._camera is None:
                self._logger.log("Opening camera")
                self._camera = picamera.PiCamera()
                self._camera.led = self._led
                self._camera.resolution = (self._config.get("width"), self._config.get("height"))
                self._camera.rotation = self._config.get("rotation")
                self._camera.hflip = self._config.get("hflip")
                self._camera.vflip = self._config.get("vflip")
                self._camera.brightness = self._config.get("brightness")
                self._camera.contrast = self._config.get("contrast")
                self._camera.saturation = self._config.get("saturation")
                self._camera.sharpness = self._config.get("sharpness")

        def close_camera(self):
            if self._camera is not None:
                self._logger.log("Closing camera")
                self._camera.close()
                self._camera = None

        def take(self):
            filename = str(int(time.time() * 1000))
            self._taking.append(filename)
            while filename in self._taking:
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

        def save_config(self, config):
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
            self._config.save()
