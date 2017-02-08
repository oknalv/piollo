class HTTPResponse(object):
    def __init__(self):
        self._status = "200 OK"
        self.http_version = "HTTP/1.1"
        self.headers = dict()
        self._body = None

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        status_str = str(value)
        if value == 200:
            status_str += " OK"

        elif value == 101:
            status_str += " Switching Protocols"

        elif value == 404:
            status_str += " Not Found"
            self.body = None

        else:
            raise HTTPStatusNotAllowed(value)

        self._status = status_str

    @property
    def body(self):
        return self._body

    @body.setter
    def body(self, value):
        if value:
            self._body = value
            self.headers["Content-Length"] = str(len(value))
        else:
            self._body = None
            if "Content-Length" in self.headers:
                self.headers.pop("Content-Length", None)

    def build(self):
        response_string = self.http_version + " " + self.status + "\r\n"
        for key in self.headers.keys():
            response_string += str(key) + ": " + self.headers[key] + "\r\n"

        response_string += "\r\n"
        if self.body:
            response_string += self.body

        return response_string


class HTTPStatusNotAllowed(Exception):
    def __init__(self, status):
        self.message = "HTTP status " + status + " not allowed."
