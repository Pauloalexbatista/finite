from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

# Interest Schemas
class InterestBase(BaseModel):
    name: str

class InterestCreate(InterestBase):
    pass

class Interest(InterestBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# Timeline Event Schemas
class TimelineEventBase(BaseModel):
    date: date
    title: str
    content: str
    event_type: str
    sentiment: Optional[str] = None
    source: str = "user"

class TimelineEventCreate(TimelineEventBase):
    user_id: int

class TimelineEvent(TimelineEventBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    date_of_birth: date

class UserCreate(UserBase):
    interests: List[InterestCreate] = []

class User(UserBase):
    id: int
    created_at: datetime
    interests: List[Interest] = []
    # life_battery will be calculated in the router/service layer or as a property

    class Config:
        orm_mode = True
