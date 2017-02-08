from httpresponse import HTTPResponse
from httprequest import HTTPRequest


class HTTPRequestHandler:
    def __init__(self, client, WebSocketHandlerClass):
        self.client = client
        self.response = HTTPResponse()
        self.request = HTTPRequest.parse(client)
        self.WebSocketHandlerClass = WebSocketHandlerClass

    def start(self):
        if self.request.method == "GET":
            self.get()

        else:
            raise MethodNotSupportedException(self.request.method)

        self.client.send(self.response.build())
        if self.response.status == "101 Switching Protocols":
            self.WebSocketHandlerClass(self.client)

        else:
            self.client.close()

    def get(self):
        pass


class MethodNotSupportedException(Exception):
    def __init__(self, method):
        self.message = "Method " + method + " not supported."
