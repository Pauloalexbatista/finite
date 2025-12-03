@echo off
title OneLife Launcher
echo ==========================================
echo       ONELIFE - MEMENTO MORI
echo ==========================================
echo.

echo [1/3] Starting Backend Server (FastAPI)...
cd backend
start "OneLife Backend" cmd /k "uvicorn main:app --reload"
cd ..

echo [2/3] Starting Frontend Server (Vite)...
cd frontend
start "OneLife Frontend" cmd /k "npm run dev"
cd ..

echo [3/3] Opening Application...
echo Waiting for servers to initialize...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo ==========================================
echo    Environment Running!
echo    Backend: http://localhost:8000
echo    Frontend: http://localhost:5173
echo ==========================================
pause
