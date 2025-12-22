import logging
import pickle
import os
import numpy as np
from typing import List, Union, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SeizureDetector:
    """
    Seizure detection using a trained Random Forest model.
    Loads the model once and reuses it for predictions.
    """
    
    def __init__(self, model_path: str = 'random_forest_model.pkl'):
        self.model = None
        self.model_path = model_path
        self._load_model()
    
    def _load_model(self):
        """Load the trained Random Forest model from pickle file."""
        try:
            # Try absolute path first
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info(f"Successfully loaded model from {self.model_path}")
            else:
                # Try relative to backend directory
                backend_path = os.path.join('backend', self.model_path)
                if os.path.exists(backend_path):
                    with open(backend_path, 'rb') as f:
                        self.model = pickle.load(f)
                    logger.info(f"Successfully loaded model from {backend_path}")
                else:
                    logger.warning(f"Model file not found at {self.model_path}, using fallback detection")
        except Exception as e:
            logger.error(f"Error loading model: {e}, using fallback detection")
            self.model = None
    
    def extract_features(self, eeg_data: Union[List[float], Dict, np.ndarray]) -> np.ndarray:
        """
        Extract the first 20 channel readings from EEG data.
        
        Args:
            eeg_data: Can be a list, dict with voltage/channel_data, or numpy array
            
        Returns:
            numpy array of shape (1, 20) ready for prediction
        """
        try:
            if isinstance(eeg_data, dict):
                # Extract voltage or channel_data if it's a dict (e.g., from MQTT message)
                if 'channel_data' in eeg_data:
                    voltage = eeg_data['channel_data']
                elif 'voltage' in eeg_data:
                    voltage = eeg_data['voltage']
                else:
                    raise ValueError("Dict must contain 'voltage' or 'channel_data' key")
            else:
                voltage = eeg_data
            
            # Convert to numpy array
            if not isinstance(voltage, np.ndarray):
                voltage = np.array(voltage)
            
            # Extract first 20 channels (all hardware readings)
            ch_data = voltage[:20]
            
            # Pad with zeros if less than 20 channels
            if len(ch_data) < 20:
                ch_data = np.pad(ch_data, (0, 20 - len(ch_data)), mode='constant')
            
            # Reshape to (1, 20) for model prediction
            return ch_data.reshape(1, -1)
            
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            # Return zeros as fallback
            return np.zeros((1, 8))
    
    def predict(self, eeg_data: Union[List[float], Dict, np.ndarray]) -> bool:
        """
        Predict if the EEG data indicates a seizure.
        
        Args:
            eeg_data: EEG readings (first 8 values are ch0-ch7)
            
        Returns:
            True if seizure detected, False otherwise
        """
        try:
            # Extract features
            features = self.extract_features(eeg_data)
            
            # Use ML model if available
            if self.model is not None:
                prediction = self.model.predict(features)[0]
                is_seizure = bool(prediction == 1)
                
                if is_seizure:
                    logger.info(f"Seizure detected by ML model! Features: {features.flatten()}")
                
                return is_seizure
            else:
                # Fallback to simple threshold-based detection
                return self._fallback_detection(features.flatten())
                
        except Exception as e:
            logger.error(f"Error in seizure prediction: {e}")
            return False
    
    def _fallback_detection(self, features: np.ndarray) -> bool:
        """
        Simple fallback detection when ML model is not available.
        Checks if average voltage exceeds threshold.
        """
        avg_voltage = np.mean(np.abs(features))
        if avg_voltage > 5.0:
            logger.info(f"Seizure detected by fallback method! Avg voltage: {avg_voltage}")
            return True
        return False


# Global singleton instance
_detector_instance = None


def get_detector() -> SeizureDetector:
    """Get or create the global detector instance."""
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = SeizureDetector()
    return _detector_instance


def detect_seizure(eeg_data: Union[List[float], Dict, np.ndarray]) -> bool:
    """
    Main function for seizure detection using ML model.
    
    Args:
        eeg_data: EEG readings (first 20 channels used for prediction)
        
    Returns:
        True if seizure detected, False otherwise
        
    Example:
        >>> data = [0.60, 1.83, 1.68, -0.94, 0.28, -0.59, -2.25, -1.81, 0, 0, ...]
        >>> detect_seizure(data)
        False
    """
    detector = get_detector()
    return detector.predict(eeg_data)
