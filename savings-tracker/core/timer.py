import time
from core.generic_logger import get_logger

logger = get_logger("timed_operations")


class TimerError(Exception):
    """A custom exception used to report errors in use of Timer class"""

class Timer:
    def __init__(self):
        self.operation_name = None
        self._start_time = None

    def start(self, operation_name):
        """Start a new timer"""
        if self._start_time is not None:
            raise TimerError(f"Timer is running. Use .stop() to stop it")
        self.operation_name = operation_name
        self._start_time = time.perf_counter()

    def stop(self):
        """Stop the timer, and report the elapsed time"""
        if self._start_time is None:
            raise TimerError(f"Timer is not running. Use .start() to start it")

        elapsed_time = time.perf_counter() - self._start_time
        self._start_time = None
        logger.info(f"{self.operation_name} completed in {elapsed_time:0.4f} seconds")