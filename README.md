# finite (The Bubble)

A life management and legacy application based on the philosophy of Memento Mori.

## Project Structure
- `frontend/`: React + Vite + Three.js application.
- `backend/`: FastAPI + SQLAlchemy application.

## How to Run

### Prerequisites
- Node.js
- Python 3.8+

### Backend
1. Navigate to `backend/`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

## Features Implemented
- **3D Bubble Visualization**: A floating, ethereal bubble representing your life.
- **API Structure**: Users, Interests, and Timeline Events management.
- **AI Investigator (Mock)**: Basic logic to find historical events based on interests.
