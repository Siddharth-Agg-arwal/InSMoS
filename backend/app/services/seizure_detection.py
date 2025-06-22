import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def detect_seizure(eeg_data: list) -> bool:
    """
    A simple placeholder for seizure detection logic.
    In a real application, this would be a sophisticated ML model.
    """
    # Example: detect a seizure if the average voltage is above a threshold
    if sum(eeg_data) / len(eeg_data) > 5.0:
        logger.info("Seizure detected!")
        return True
    return False
