from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime

class SentimentType(str, enum.Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class EventType(str, enum.Enum):
    PERSONAL = "personal"
    HISTORICAL = "historical"
    FUTURE = "future"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    date_of_birth = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interests = relationship("Interest", back_populates="user")
    timeline_events = relationship("TimelineEvent", back_populates="user")

class Interest(Base):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., "U2", "Benfica"
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="interests")

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, index=True)
    title = Column(String)
    content = Column(Text)
    event_type = Column(String) # personal, historical, future
    sentiment = Column(String, nullable=True) # For personal events
    source = Column(String) # "user" or "investigator_ai"
    
    user = relationship("User", back_populates="timeline_events")
