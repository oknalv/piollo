from camerasingleton import CameraSingleton
from filesingleton import FileSingleton
from httprequesthandler import HTTPRequestHandler
from thumbnailer import Thumbnailer
from os import listdir
import json
import string
import hashlib
import base64


class MyHTTPRequestHandler(HTTPRequestHandler):
    def __init__(self, client, WebSocketHandlerClass):
        HTTPRequestHandler.__init__(self, client, WebSocketHandlerClass)
        self.files = FileSingleton.get_instance()

    def get(self):
        try:
            if self.request.request_uri == "/":
                self.response.status = 200
                self.response.headers["Content-Type"] = "text/html"
                self.response.body = self.files.get_index()

            elif self.request.request_uri.startswith("/css/"):
                file_name = self.request.request_uri[5:]
                self.response.body = self.files.get_css(file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "text/css"

            elif self.request.request_uri.startswith("/js/"):
                file_name = self.request.request_uri[4:]
                self.response.body = self.files.get_js(file_name)
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
                    raise IOError()

                self.response.body = self.files.get_font(file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "font/" + file_type

            elif self.request.request_uri.startswith("/img/") or self.request.request_uri.startswith("/pictures/") or self.request.request_uri.startswith("/thumbnails/"):
                uri_split = self.request.request_uri[1:].split("/")
                folder_name = uri_split[0]
                if folder_name not in ["img", "pictures", "thumbnails"]:
                    raise IOError()

                file_name = "/".join(uri_split[1:])
                file_type = None
                if file_name.endswith(".svg"):
                    file_type = "svg+xml"

                elif file_name.endswith(".png"):
                    file_type = "png"

                elif file_name.endswith(".jpeg"):
                    file_type = "jpeg"

                else:
                    raise IOError()

                self.response.body = self.files.get_image(folder_name, file_name)
                self.response.status = 200
                self.response.headers["Content-Type"] = "image/" + file_type

            elif self.request.request_uri == "/gallery":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = json.dumps(sorted(listdir("pictures"), reverse=True))

            elif self.request.request_uri == "/take":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = '{"image":"' + CameraSingleton.get_instance().take(self) + '"}'

            elif self.request.request_uri == "/take":
                self.response.status = 200
                self.response.headers["Content-Type"] = "application/json"
                self.response.body = '{"led":' + 'true' if CameraSingleton.get_instance().is_led_on() else 'false' + '}'

            elif self.request.request_uri == "/led":
                if self.request.query_string == "on=true":
                    CameraSingleton.get_instance().led_on()

                elif self.request.query_string == "on=false":
                    CameraSingleton.get_instance().led_off()

                self.response.body =\
                    '{"led":' + ('true' if CameraSingleton.get_instance().is_led_on() else 'false') + '}'

            elif self.request.request_uri == "/streaming":
                self.response.status = 101
                self.response.headers["Upgrade"] = "websocket"
                self.response.headers["Connection"] = "Upgrade"
                hasher = hashlib.sha1()
                hasher.update(self.request.headers["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
                self.response.headers["Sec-WebSocket-Accept"] = base64.b64encode(hasher.digest())

            else:
                raise IOError()

        except IOError:
            self.response.status = 404

