from worker import Worker
from camerasingleton import CameraSingleton
from loggersingleton import LoggerSingleton
import socket
import sys


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(("192.168.3.14", 80))
server.listen(100)
LoggerSingleton.get_instance("console_log" in sys.argv)
CameraSingleton.get_instance().start()

while True:
    try:
        (client, address) = server.accept()
        LoggerSingleton.get_instance().log("Connection from " + str(address))
        worker = Worker(client)
        worker.daemon = True
        worker.start()

    except KeyboardInterrupt:
        print "Bye bye..."
        break

server.close()
