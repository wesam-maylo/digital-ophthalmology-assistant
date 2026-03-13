from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.prediction import Prediction
from app.services.ai_service import predict_image

router = APIRouter(prefix="/api/v1", tags=["predict"])


class PredictRequest(BaseModel):
    id: Optional[int] = None
    image_id: Optional[str] = None


@router.post("/predict")
def run_prediction(payload: PredictRequest, db: Session = Depends(get_db)):
    if payload.id is None and not payload.image_id:
        raise HTTPException(status_code=400, detail="Provide either 'id' or 'image_id'")

    record = None
    if payload.id is not None:
        record = db.query(Prediction).filter(Prediction.id == payload.id).first()
    elif payload.image_id:
        like_pattern = f"%{payload.image_id}%"
        record = db.query(Prediction).filter(Prediction.image_path.like(like_pattern)).first()

    if not record:
        raise HTTPException(status_code=404, detail="Image ID not found")
    if not Path(record.image_path).exists():
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        label, confidence = predict_image(record.image_path)
    except Exception:
        raise HTTPException(status_code=500, detail="Prediction failed") from None

    record.prediction = label
    record.confidence = confidence
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "image_path": record.image_path,
        "prediction": record.prediction,
        "confidence": record.confidence,
        "created_at": record.created_at,
    }
