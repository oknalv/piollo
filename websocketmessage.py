from struct import *


class WebSocketMessage:
    def __init__(self, data):
        self.data = data

    def get_chunk(self):
        bytes = bytearray()
        bytes.append(0b10000010)
        data_length = len(self.data)
        if data_length <= 125:
            bytes.append(data_length)
        elif data_length <= 65535:
            bytes.append(126)
            bytes.extend(pack(">H", data_length))
        elif data_length <= 18446744073709551615:
            bytes.append(127)
            bytes.extend(pack(">Q", data_length))

        return bytes + self.data