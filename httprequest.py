class HTTPRequest:
    def __init__(self, method=None, request_uri=None, query_string = None, http_version=None, headers=None, body=None):
        self.method = method
        self.request_uri = request_uri
        self.query_string = query_string
        self.http_version = http_version
        if not headers:
            headers = dict()
        self.headers = headers
        self.body = body

    @staticmethod
    def parse(client):
        request = HTTPRequest()
        request_file = client.makefile()
        line = request_file.readline()
        line_split = line.split(" ")
        request.method = line_split[0]
        full_uri = line_split[1].split("?")
        request.request_uri = full_uri[0]
        request.query_string = "" if len(full_uri) <= 1 else full_uri[1]
        request.http_version = line_split[2]
        line = request_file.readline()
        while line != "\r\n":
            line_split = line.split(": ")
            request.headers[line_split[0]] = line_split[1].strip()
            line = request_file.readline()

        if "Content-Length" in request.headers:
            request.body = request_file.read(int(request.headers["Content-Length"]))

        request_file.close()
        return request
