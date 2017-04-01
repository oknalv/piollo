import string


class FileGetter:
    _READ_BYTES = "rb"
    _READ_TEXT = "rU"
    _APP_FOLDER = "app"

    @staticmethod
    def get_index():
        return FileGetter._get_file(FileGetter._APP_FOLDER + "/" + "index.html", FileGetter._READ_TEXT)

    @staticmethod
    def get_css(file_name):
        return FileGetter._get_file(FileGetter._APP_FOLDER + "/" + "css/" + file_name, FileGetter._READ_TEXT)

    @staticmethod
    def get_js(file_name):
        return FileGetter._get_file(FileGetter._APP_FOLDER + "/" + "js/" + file_name, FileGetter._READ_TEXT)

    @staticmethod
    def get_font(file_name):
        return FileGetter._get_file(FileGetter._APP_FOLDER + "/" + "fonts/" + file_name, FileGetter._READ_BYTES)

    @staticmethod
    def get_image(folder_name, file_name):
        if folder_name == "img":
            folder_name = FileGetter._APP_FOLDER + "/" + folder_name
        if file_name.endswith(".svg"):
            data = FileGetter._get_file(folder_name + "/" + file_name, FileGetter._READ_TEXT)

        else:
            print(folder_name + "/" + file_name, FileGetter._READ_BYTES)
            data = FileGetter._get_file(folder_name + "/" + file_name, FileGetter._READ_BYTES)

        return data

    @staticmethod
    def get_lang(file_name):
        return FileGetter._get_file(FileGetter._APP_FOLDER + "/" + "langs/" + file_name, FileGetter._READ_TEXT)

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

