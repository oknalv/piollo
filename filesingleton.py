from thumbnailer import Thumbnailer
import string


class FileSingleton:
    _instance = None

    @staticmethod
    def get_instance():
        if FileSingleton._instance is None:
            FileSingleton._instance = FileSingleton._FileSingleton()

        return FileSingleton._instance

    class _FileSingleton(object):
        def __init__(self):
            self.css = {}
            self.js = {}
            self.fonts = {}
            self.READ_BYTES = 0
            self.READ_TEXT = 1

        def get_index(self):
            f = open("index.html", "rU")
            data = string.join(f.readlines())
            f.close()
            return data

        def get_css(self, file_name):
            #if file_name not in self.css.keys():
            if file_name not in self.css.keys() or file_name != "font-awesome.min.css":
                f = open("css/" + file_name, "rU")
                self.css[file_name] = string.join(f.readlines())
                f.close()

            return self.css[file_name]

        def get_js(self, file_name):
            #if file_name not in self.js.keys():
            if file_name not in self.js.keys() or file_name != "angular.min.js":
                f = open("js/" + file_name, "rU")
                self.js[file_name] = string.join(f.readlines())
                f.close()

            return self.js[file_name]

        def get_font(self, file_name):
            if file_name not in self.fonts.keys():
                f = open("fonts/" + file_name, "rb")
                self.fonts[file_name] = f.read()
                f.close()

            return self.fonts[file_name]

        def get_image(self, folder_name, file_name):
            data = None
            if folder_name == "thumbnails":
                f = Thumbnailer.get_thumbnail(file_name)
                data = f.read()
                f.close()

            else:
                if file_name.endswith(".svg"):
                    f = open(folder_name + "/" + file_name, "rU")
                    data = string.join(f.readlines())
                    f.close()

                else:
                    f = open(folder_name + "/" + file_name, "rb")
                    data = f.read()
                    f.close()

            return data
