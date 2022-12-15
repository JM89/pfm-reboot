from functools import wraps

from flask import jsonify

from config import get_config_section
from core.generic_logger import get_logger
from core.timer import Timer

logger = get_logger("src", get_config_section('LoggerConfig'))
timer = Timer(logger)


def api_action(func):
    @wraps(func)
    def safe_api_actions(*args, **kwargs):
        timer.start(f"API endpoint: {func.__doc__}")
        result = {}
        try:
            result = func(*args, **kwargs)
        except Exception:
            logger.error(f"Unhandled exception occurred while calling the api action {func.__name__}. Check the logs!")
        finally:
            timer.stop()
        return jsonify(result)

    return safe_api_actions
