from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app import models, database
from .app.routers import users, timeline

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="OneLife API", description="Backend for OneLife Application")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(timeline.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to OneLife API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
