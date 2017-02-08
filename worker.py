from threading import Thread
from httprequesthandler import MethodNotSupportedException
from myhttprequesthandler import MyHTTPRequestHandler
from mywebsockethandler import MyWebSocketHandler


class Worker(Thread):

    def __init__(self, client):
        Thread.__init__(self)
        self.client = client
        self.request = None

    def run(self):
        try:
            self.request = MyHTTPRequestHandler(self.client, MyWebSocketHandler)
            self.request.start()

        except MethodNotSupportedException as e:
            self.request.close()
            print e.message

