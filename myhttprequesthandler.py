from camerasingleton import CameraSingleton
from filegetter import FileGetter
from httprequesthandler import HTTPRequestHandler
from loggersingleton import LoggerSingleton
from os import listdir
import json
import hashlib
import base64


class MyHTTPRequestHandler(HTTPRequestHandler):
    def __init__(self, client, WebSocketHandlerClass):
        HTTPRequestHandler.__init__(self, client, WebSocketHandlerClass)
        self._logger = LoggerSingleton.get_instance()

    def get(self):
        self._logger.log("GET: " + self.request.request_uri)
        try:
            if self.request.request_uri == "/":
                self.response.status = 200
                self.response.headers["Content-Type"] = "text/html"
                self.response.body = FileGetter.get_index()

            elif self.request.request_uri.startswith("/css/"):
                file_name = self.request.request_uri[5:]
                self.response.body = FileGetter.get_css(file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "text/css"

            elif self.request.request_uri.startswith("/js/"):
                file_name = self.request.request_uri[4:]
                self.response.body = FileGetter.get_js(file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "text/javascript"

            elif self.request.request_uri.startswith("/fonts/"):
                file_name = self.request.request_uri[7:]
                file_type = None
                if file_name.endswith(".woff2"):
                    file_type = "woff2"

                elif file_name.endswith(".woff"):
                    file_type = "woff"

                elif file_name.endswith(".ttf"):
                    file_type = "ttf"

                else:
                    raise IOError("Font file format not supported.")

                self.response.body = FileGetter.get_font(file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "font/" + file_type

            elif self.request.request_uri.startswith("/img/") or self.request.request_uri.startswith("/pictures/"):
                uri_split = self.request.request_uri[1:].split("/")
                folder_name = uri_split[0]
                if folder_name not in ["img", "pictures"]:
                    raise IOError("Image folder not supported.")

                file_name = "/".join(uri_split[1:])
                file_type = None
                if file_name.endswith(".svg"):
                    file_type = "svg+xml"

                elif file_name.endswith(".png"):
                    file_type = "png"

                elif file_name.endswith(".jpeg"):
                    file_type = "jpeg"

                elif file_name.endswith(".gif"):
                    file_type = "gif"

                else:
                    raise IOError("Image file format nos supported.")

                self.response.body = FileGetter.get_image(folder_name, file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "image/" + file_type

            elif self.request.request_uri.startswith("/langs/"):
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                file_name = self.request.request_uri[7:]
                self.response.body = FileGetter.get_lang(file_name)

            elif self.request.request_uri == "/gallery":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = json.dumps(sorted(listdir("pictures"), reverse=True)) or "[]"

            elif self.request.request_uri == "/take":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = '{"image":"' + CameraSingleton.get_instance().take() + '"}'

            elif self.request.request_uri == "/led":
                if self.request.query_string == "on=true":
                    CameraSingleton.get_instance().led_on()

                elif self.request.query_string == "on=false":
                    CameraSingleton.get_instance().led_off()

                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body =\
                    '{"led":' + ('true' if CameraSingleton.get_instance().is_led_on() else 'false') + '}'

            elif self.request.request_uri == "/config":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = json.dumps(CameraSingleton.get_instance().get_config())

            elif self.request.request_uri == "/streaming":
                self.response.status = 101
                self.response.headers["Upgrade"] = "websocket"
                self.response.headers["Connection"] = "Upgrade"
                hasher = hashlib.sha1()
                hasher.update(self.request.headers["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
                self.response.headers["Sec-WebSocket-Accept"] = base64.b64encode(hasher.digest())

            else:
                raise IOError("Resource not supported.")

        except IOError as e:
            self._logger.log(e.message)
            self.response.status = 404

    def post(self):
        self._logger.log("POST: " + self.request.request_uri)
        try:
            if self.request.request_uri.startswith("/config/"):
                uri_remain = self.request.request_uri[8:]
                if uri_remain == "apply":
                    CameraSingleton.get_instance().apply_config(json.loads(self.request.body))
                    self.response.status = 200
                    self.response.headers["Content-Type"] = "application/json"
                    self.response.body = json.dumps(CameraSingleton.get_instance().get_config())

                else:
                    raise IOError("Config action not supported.")

            else:
                raise IOError("Resource not suported")

        except IOError as e:
            self._logger.log(e.message)
            self.response.status = 404
