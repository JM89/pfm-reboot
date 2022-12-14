import logging

from pygelf import GelfUdpHandler


def get_logger(logger_name, logger_config):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(GelfUdpHandler(
        host=logger_config['LogAgentHost'],
        port=int(logger_config['LogAgentPort']),
        _app_version="1.0.0",
        _app_name='savings-tracker',
        _env='local',
        additional_env_fields={'username': 'USERNAME'}  # other environment variable on your machine
    ))
    consoleHandler = logging.StreamHandler()
    consoleHandler.setLevel(logging.INFO)
    logger.addHandler(consoleHandler)

    logger.propagate = False

    return logger
