"""
AI Prediction Service for Campus Digital Twin
FastAPI microservice for ML-based predictions
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import numpy as np
import random
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = FastAPI(
    title="Campus Digital Twin AI Service",
    description="Machine Learning predictions for smart campus infrastructure",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models (initialized on startup)
maintenance_model = None
energy_model = None
anomaly_model = None
scaler = None


class SensorData(BaseModel):
    """Sensor data input model"""
    sensor_id: str
    sensor_type: str
    value: float
    timestamp: Optional[datetime] = None
    building_id: Optional[str] = None


class PredictionRequest(BaseModel):
    """Prediction request model"""
    building_id: str
    sensor_data: Optional[List[SensorData]] = None
    time_horizon: int = 7  # days


class MaintenancePrediction(BaseModel):
    """Maintenance prediction output"""
    equipment_id: str
    failure_probability: float
    risk_level: str
    days_until_failure: int
    recommendation: str
    confidence: float


class EnergyPrediction(BaseModel):
    """Energy prediction output"""
    building_id: str
    predicted_usage: float
    unit: str = "kWh"
    confidence_interval: Dict[str, float]
    optimization_tips: List[str]


class AnomalyDetection(BaseModel):
    """Anomaly detection output"""
    timestamp: datetime
    sensor_id: str
    anomaly_score: float
    is_anomaly: bool
    anomaly_type: Optional[str] = None


def initialize_models():
    """Initialize ML models with mock data for demonstration"""
    global maintenance_model, energy_model, anomaly_model, scaler
    
    # Initialize scaler
    scaler = StandardScaler()
    
    # Create mock models (in production, load trained models)
    # Random Forest for maintenance prediction
    maintenance_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    
    # Random Forest for energy prediction
    energy_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    
    # Isolation Forest would be used for anomaly detection
    # Using RandomForest as placeholder
    anomaly_model = RandomForestClassifier(
        n_estimators=50,
        max_depth=5,
        random_state=42
    )
    
    print("AI Models initialized successfully")


@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    initialize_models()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Campus Digital Twin AI Service",
        "version": "1.0.0",
        "models": ["maintenance", "energy", "anomaly"]
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": {
            "maintenance": maintenance_model is not None,
            "energy": energy_model is not None,
            "anomaly": anomaly_model is not None
        }
    }


@app.post("/predict/maintenance", response_model=List[MaintenancePrediction])
async def predict_maintenance(request: PredictionRequest):
    """
    Predict equipment maintenance needs
    
    Returns list of equipment with failure probability and recommendations
    """
    try:
        predictions = []
        
        # Mock prediction logic (in production, use trained model)
        equipment_list = [
            {"id": "HVAC-001", "type": "HVAC", "building": "Engineering Block"},
            {"id": "ELEV-A", "type": "Elevator", "building": "Main Library"},
            {"id": "PUMP-01", "type": "Water Pump", "building": "Science Lab"},
            {"id": "GEN-01", "type": "Generator", "building": "Admin Building"},
            {"id": "AC-001", "type": "Air Conditioner", "building": "Student Center"}
        ]
        
        for equipment in equipment_list:
            # Generate random prediction (mock)
            failure_prob = random.uniform(0.1, 0.7)
            
            if failure_prob > 0.6:
                risk = "high"
                days = random.randint(1, 5)
                recommendation = f"Immediate inspection required for {equipment['type']}. Schedule maintenance within {days} days."
            elif failure_prob > 0.3:
                risk = "medium"
                days = random.randint(5, 14)
                recommendation = f"Plan maintenance for {equipment['type']} within {days} days."
            else:
                risk = "low"
                days = random.randint(14, 30)
                recommendation = f"Continue regular monitoring. Next maintenance suggested in {days} days."
            
            predictions.append(MaintenancePrediction(
                equipment_id=equipment["id"],
                failure_probability=round(failure_prob * 100, 1),
                risk_level=risk,
                days_until_failure=days,
                recommendation=recommendation,
                confidence=random.uniform(0.75, 0.95)
            ))
        
        return predictions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/energy", response_model=List[EnergyPrediction])
async def predict_energy(request: PredictionRequest):
    """
    Predict energy consumption and provide optimization tips
    """
    try:
        predictions = []
        
        # Mock prediction logic
        buildings = [
            {"id": "LIB", "name": "Main Library"},
            {"id": "ENG", "name": "Engineering Block"},
            {"id": "STU", "name": "Student Center"},
            {"id": "SCI", "name": "Science Lab"},
            {"id": "ADM", "name": "Admin Building"}
        ]
        
        for building in buildings:
            # Generate mock predictions
            base_usage = random.uniform(800, 2500)
            predicted = base_usage + random.uniform(-200, 200)
            
            tips = []
            if predicted > 1500:
                tips.append("Consider reducing HVAC usage during peak hours")
            if random.random() > 0.5:
                tips.append("Optimize lighting schedule with motion sensors")
            if random.random() > 0.6:
                tips.append("Increase solar panel utilization")
            tips.append("Schedule high-power equipment during off-peak hours")
            
            predictions.append(EnergyPrediction(
                building_id=building["id"],
                predicted_usage=round(predicted, 2),
                unit="kWh",
                confidence_interval={
                    "lower": round(predicted * 0.85, 2),
                    "upper": round(predicted * 1.15, 2)
                },
                optimization_tips=tips
            ))
        
        return predictions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect/anomaly", response_model=List[AnomalyDetection])
async def detect_anomalies(data: List[SensorData]):
    """
    Detect anomalies in sensor data
    """
    try:
        anomalies = []
        
        for sensor in data:
            # Mock anomaly detection
            # In production, use trained anomaly detection model
            anomaly_score = random.uniform(0, 1)
            is_anomaly = anomaly_score > 0.7
            
            anomaly_type = None
            if is_anomaly:
                types = ["spike", "drop", "unusual_pattern", "sensor_drift"]
                anomaly_type = random.choice(types)
            
            anomalies.append(AnomalyDetection(
                timestamp=sensor.timestamp or datetime.now(),
                sensor_id=sensor.sensor_id,
                anomaly_score=round(anomaly_score, 3),
                is_anomaly=is_anomaly,
                anomaly_type=anomaly_type
            ))
        
        return anomalies
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/risk-assessment")
async def get_risk_assessment():
    """
    Get overall campus risk assessment
    """
    try:
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_risk_score": random.uniform(60, 90),
            "risk_categories": {
                "infrastructure": {
                    "score": random.uniform(70, 95),
                    "risk_level": random.choice(["low", "medium"]),
                    "concerns": ["Aging HVAC systems in some buildings"]
                },
                "energy": {
                    "score": random.uniform(65, 90),
                    "risk_level": random.choice(["low", "medium"]),
                    "concerns": ["Peak load management needed"]
                },
                "security": {
                    "score": random.uniform(80, 98),
                    "risk_level": "low",
                    "concerns": []
                },
                "maintenance": {
                    "score": random.uniform(60, 85),
                    "risk_level": random.choice(["low", "medium", "high"]),
                    "concerns": ["Elevator maintenance overdue", "Some sensors need calibration"]
                }
            },
            "recommendations": [
                "Prioritize HVAC maintenance in Engineering Block",
                "Review security access logs for anomalies",
                "Schedule preventive maintenance for elevators"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/simulate/training")
async def simulate_training(background_tasks: BackgroundTasks):
    """
    Simulate model training (for demonstration)
    """
    def train_models():
        # Simulate training delay
        import time
        time.sleep(2)
        initialize_models()
        print("Models retrained successfully")
    
    background_tasks.add_task(train_models)
    
    return {
        "status": "training_started",
        "message": "Model training initiated in background",
        "estimated_time": "30 seconds"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
