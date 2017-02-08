from loggersingleton import LoggerSingleton
import picamera
from io import BytesIO
from threading import Thread
import time


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
            self.closed = False
            self.observers = []
            self.camera = None
            self.taking = []
            self._led = True

        def add_observer(self, observer):
            self.observers.append(observer)

        def notify_observers(self, image):
            closed = []
            if self.observers:
                LoggerSingleton.get_instance().log("Sending frame to " + str(len(self.observers)) + " clients")
            for observer in self.observers:
                if observer.is_closed():
                    closed.append(observer)
                else:
                    observer.notify(image)

            for c in closed:
                self.observers.remove(c)

        def run(self):
            while True:
                if self.observers or self.taking:
                    self.open_camera()

                    if self.camera:
                        image = BytesIO()
                        self.camera.capture(image, "jpeg")
                        self.notify_observers(image.getvalue())

                    if self.taking:
                        for filename in self.taking:
                            self.camera.capture("pictures/" + filename)
                            self.taking.remove(filename)

                else:
                    self.close_camera()

        def delete_observer(self, observer):
            self.observers.remove(observer)

        def open_camera(self):
            if self.camera is None:
                LoggerSingleton.get_instance().log("Camera open")
                self.camera = picamera.PiCamera()
                self.camera.led = self._led

        def close_camera(self):
            if self.camera is not None:
                LoggerSingleton.get_instance().log("Camera closed")
                self.camera.close()
                self.camera = None

        def take(self, client):
            filename = str(int(time.time() * 1000)) + ".jpeg"
            self.taking.append(filename)
            while filename in self.taking:
                pass
            return filename

        def led_on(self):
            self._led = True
            if self.camera:
                self.camera.led = True

        def led_off(self):
            self._led = False
            if self.camera:
                self.camera.led = False

        def is_led_on(self):
            return self._led

