from loggersingleton import LoggerSingleton
from select import select
from struct import unpack_from


class WebSocketHandler:
    def __init__(self, client):
        self.client = client
        self.closed = False
        self.setup()

    def setup(self):
        pass

    def received_message(self, message):
        pass

    def is_closed(self):
        if self.closed:
            return True

        i, o, e = select([], [self.client], [])
        if o:
            return False

        self.client.close()
        return True

    def read(self):
        fin = False
        message = ""
        while not fin:
            first_bytes = bytearray(2)
            self.client.settimeout(0)
            self.client.recv_into(first_bytes)
            fin = first_bytes[0] & 0b10000000 > 0
            rsv = first_bytes[0] & 0b01110000 >> 4
            opcode = first_bytes[0] & 0b00001111
            mask = first_bytes[1] & 0b10000000 > 0
            payload_length = first_bytes[1] & 0b01111111
            payload = None
            masking_key = None
            if payload_length > 0:
                if payload_length == 126:
                    aux_buff = bytearray(2)
                    self.client.recv_into(aux_buff)
                    payload_length = unpack_from(">H", aux_buff)

                elif payload_length == 127:
                    aux_buff = bytearray(8)
                    self.client.recv_into(aux_buff)
                    payload_length = unpack_from(">Q", aux_buff)

            if mask:
                masking_key = bytearray(4)
                self.client.recv_into(masking_key)

            if payload_length > 0:
                payload = bytearray(payload_length)
                self.client.recv_into(payload, payload_length)

            if opcode == 8:
                self.closed = True
                self.client.close()
                return

            elif not (opcode == 1 or opcode == 0):
                raise OpcodeNotSupportedException(opcode)

            else:
                if not mask and payload_length > 0:
                    LoggerSingleton.get_instance().log(
                        "Payload not masked: fin = " + str(fin) + ", rsv = " + str(rsv) + ", opcode = " + str(opcode) +
                        ", mask = " + str(mask) + ", payload_length = " + str(payload_length)
                    )
                    raise NotMaskedException()

                elif payload is not None:
                    for i in range(payload_length):
                        payload[i] ^= masking_key[i % 4]

                    message += str(payload)

        self.received_message(message)


class OpcodeNotSupportedException(Exception):
    def __init__(self, opcode):
        self.message = "opcode " + str(opcode) + " not supported."


class NotMaskedException(Exception):
    pass

