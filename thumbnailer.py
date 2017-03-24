from loggersingleton import LoggerSingleton
from os import path, link
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
        try:
            if not path.exists("pictures/" + name):
                raise IOError()
            LoggerSingleton.get_instance().log("Creating thumbnail for " + name)
            im = Image.open("pictures/" + name)
            format_ = im.format
            if format_ == "GIF":
                """This is going to be this way until I figure out how to make gif thumbnails"""
                link("pictures/" + name, "thumbnails/" + name)

            else:
                im.thumbnail((128, 128))
                im.save("thumbnails/" + name, format_)

            im.close()

        except Exception as e:
            LoggerSingleton.get_instance().log("ERROR: " + e.message)
            raise e

