from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import models, schemas, database

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create User
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        date_of_birth=user.date_of_birth
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Add Interests
    for interest in user.interests:
        new_interest = models.Interest(name=interest.name, user_id=new_user.id)
        db.add(new_interest)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/{user_id}/life-battery")
def get_life_battery(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    today = date.today()
    dob = db_user.date_of_birth
    
    # Calculate years lived (approx)
    age_years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    # Calculate weeks lived
    delta = today - dob
    weeks_lived = delta.days // 7
    total_weeks_100_years = 5214 # Approx 100 * 52.14
    
    return {
        "years_lived": age_years,
        "weeks_lived": weeks_lived,
        "total_years": 100,
        "total_weeks": total_weeks_100_years,
        "percentage_used": round((weeks_lived / total_weeks_100_years) * 100, 2)
    }
