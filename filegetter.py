from thumbnailer import Thumbnailer
import string


class FileGetter:
    _READ_BYTES = "rb"
    _READ_TEXT = "rU"

    @staticmethod
    def get_index():
        return FileGetter._get_file("index.html", FileGetter._READ_TEXT)

    @staticmethod
    def get_css(file_name):
        return FileGetter._get_file("css/" + file_name, FileGetter._READ_TEXT)

    @staticmethod
    def get_js(file_name):
        return FileGetter._get_file("js/" + file_name, FileGetter._READ_TEXT)

    @staticmethod
    def get_font(file_name):
        return FileGetter._get_file("fonts/" + file_name, FileGetter._READ_BYTES)

    @staticmethod
    def get_image(folder_name, file_name):
        data = None
        if folder_name == "thumbnails":
            f = Thumbnailer.get_thumbnail(file_name)
            data = f.read()
            f.close()

        else:
            if file_name.endswith(".svg"):
                data = FileGetter._get_file(folder_name + "/" + file_name, FileGetter._READ_TEXT)

            else:
                print(folder_name + "/" + file_name, FileGetter._READ_BYTES)
                data = FileGetter._get_file(folder_name + "/" + file_name, FileGetter._READ_BYTES)

        return data

    @staticmethod
    def get_lang(file_name):
        return FileGetter._get_file("langs/" + file_name, FileGetter._READ_TEXT)

    @staticmethod
    def _get_file(file_path, mode):
        f = open(file_path, mode)
        data = None
        if mode == FileGetter._READ_BYTES:
            data = f.read()

        else:
            data = string.join(f.readlines())

        f.close()
        return data

