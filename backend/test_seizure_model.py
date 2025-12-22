#!/usr/bin/env python3
"""
Test script for seizure detection with live readings
"""
import numpy as np
from app.services.seizure_detection import detect_seizure, SeizureDetector

# Sample input - first 8 indices are ch0 to ch7 hardware readings
sample_data = np.array([
    0.6012908, 1.83178702, 1.68688363, -0.94089089, 
    0.2842835, -0.59867488, -2.25442024, -1.81560197,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
])

def test_detection():
    print("Testing Seizure Detection Model")
    print("=" * 50)
    
    # Initialize detector
    detector = SeizureDetector(model_path='random_forest_model.pkl')
    
    print(f"\nModel loaded: {detector.model is not None}")
    print(f"Model type: {type(detector.model)}")
    
    # Test with sample data
    print(f"\nSample data (first 8 channels): {sample_data[:8]}")
    
    # Extract features
    features = detector.extract_features(sample_data)
    print(f"Extracted features shape: {features.shape}")
    print(f"Features: {features.flatten()}")
    
    # Make prediction
    result = detect_seizure(sample_data)
    print(f"\nSeizure detected: {result}")
    
    # Test with different formats
    print("\n" + "=" * 50)
    print("Testing different input formats:")
    
    # List format
    result_list = detect_seizure(sample_data.tolist())
    print(f"List input - Seizure detected: {result_list}")
    
    # Dict format (like from MQTT)
    result_dict = detect_seizure({'voltage': sample_data.tolist()})
    print(f"Dict input - Seizure detected: {result_dict}")
    
    # Test multiple samples
    print("\n" + "=" * 50)
    print("Testing multiple random samples:")
    
    for i in range(5):
        # Generate random EEG-like data
        random_data = np.random.randn(20) * 2
        result = detect_seizure(random_data)
        print(f"Sample {i+1} - Mean: {np.mean(random_data[:8]):.2f}, Seizure: {result}")
    
    print("\n" + "=" * 50)
    print("Test complete!")

if __name__ == "__main__":
    test_detection()
