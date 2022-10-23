import logging
import sys
from logging.handlers import TimedRotatingFileHandler
#from pygelf import GelfUdpHandler

LOG_FILE = "savings-tracker-api.log"


class OneLineExceptionFormatter(logging.Formatter):
    def formatException(self, exc_info):
        """
        Format an exception so that it prints on a single line.
        """
        result = super().formatException(exc_info)
        return repr(result)  # or format into one line however you want to

    def format(self, record):
        s = super().format(record)
        if record.exc_text:
            s = s.replace('\n', '') + '|'
        return s


def get_console_handler():
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(FORMATTER)
    return console_handler


def get_file_handler_with_exception():
    fh = logging.FileHandler(LOG_FILE, 'w')
    f = OneLineExceptionFormatter('%(asctime)s|%(levelname)s|%(message)s|',
                                  '%d/%m/%Y %H:%M:%S')
    fh.setFormatter(f)
    return fh

def get_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)  # better to have too much log than not enough
    # logger.addHandler(get_console_handler())
    logger.addHandler(get_file_handler_with_exception())
    #logger.addHandler(GelfUdpHandler(host='127.0.0.1', port=5341))
    # with this pattern, it's rarely necessary to propagate the error up to parent
    logger.propagate = False


    return logger
