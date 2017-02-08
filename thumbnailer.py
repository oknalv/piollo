from loggersingleton import LoggerSingleton
from os import path
from PIL import Image


class Thumbnailer:
    @staticmethod
    def get_thumbnail(name):
        if not path.exists("pictures/" + name):
            raise IOError()

        if not path.exists("thumbnails/" + name):
            Thumbnailer.create_thumbnail(name)

        return open("thumbnails/" + name, "rb")

    @staticmethod
    def create_thumbnail(name):
        if not path.exists("pictures/" + name):
            raise IOError()
        LoggerSingleton.get_instance().log("Creating thumbnail for " + name)
        im = Image.open("pictures/" + name)
        im.thumbnail((128, 128))
        im.save("thumbnails/" + name, im.format)
        im.close()
