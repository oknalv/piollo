from websockethandler import WebSocketHandler, OpcodeNotSupportedException
from camerasingleton import CameraSingleton
from websocketmessage import WebSocketMessage
from loggersingleton import LoggerSingleton
from socket import error


class MyWebSocketHandler(WebSocketHandler):
    def setup(self):
        CameraSingleton.get_instance().add_observer(self)

    def received_message(self, message):
        LoggerSingleton.get_instance().log("Received message from client " + self.client + ": " + message)

    def notify(self, data):
        try:
            self.read()

        except error:
            pass

        except OpcodeNotSupportedException as e:
            print e.message
            raise e

        if not self.closed:
            web_socket_message = WebSocketMessage(data)
            self.client.settimeout(None)
            self.client.send(web_socket_message.get_chunk())
