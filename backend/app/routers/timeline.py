from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/timeline",
    tags=["timeline"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TimelineEvent)
def create_timeline_event(event: schemas.TimelineEventCreate, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == event.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_event = models.TimelineEvent(**event.dict())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/{user_id}", response_model=List[schemas.TimelineEvent])
def read_timeline(user_id: int, db: Session = Depends(get_db)):
    events = db.query(models.TimelineEvent).filter(models.TimelineEvent.user_id == user_id).all()
    return events
