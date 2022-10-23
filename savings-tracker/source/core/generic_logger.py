import logging
import sys
from pygelf import GelfUdpHandler

def get_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(GelfUdpHandler(
        host='127.0.0.1',
        port=12201,
        _app_version="1.0.0",
        _app_name='savings-tracker',
        _env='local',
        additional_env_fields={'username': 'USERNAME'} # other environment variable on your machine
    ))
    logger.propagate = False


    return logger
