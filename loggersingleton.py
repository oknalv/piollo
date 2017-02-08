class LoggerSingleton:
    _instance = None

    @staticmethod
    def get_instance(console_log=False):
        if LoggerSingleton._instance is None:
            LoggerSingleton._instance = LoggerSingleton._Logger()
            if console_log:
                LoggerSingleton._instance.set_next(LoggerSingleton._ConsoleLogger())

        return LoggerSingleton._instance

    class _Logger(object):
        def __init__(self):
            self.next_logger = None

        def log(self, message):
            if self.next_logger is not None:
                self.next_logger.log(message)

        def set_next(self, next):
            if self.next_logger is not None:
                self.next_logger.set_next(next)

            else:
                self.next_logger = next

    class _ConsoleLogger(_Logger):
        def __init__(self):
            LoggerSingleton._Logger.__init__(self)

        def log(self, message):
            print message
            LoggerSingleton._Logger.log(self, message)

