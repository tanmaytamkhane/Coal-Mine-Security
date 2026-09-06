@echo off
title TASQ COAL - SIH26025 Live System Launcher
echo ======================================================================
echo    TASQ COAL - SIH26025 Mine Subsidence AI Early Warning System
echo ======================================================================
echo.
echo [1/2] Starting Python XGBoost ML Backend on http://127.0.0.1:8000 ...
start TASQ Coal ML Backend (XGBoost 3.2.0) cmd /k python backend/server.py

echo [2/2] Starting Next.js Production Web Dashboard on http://localhost:3005 ...
start TASQ Coal Next.js Dashboard cmd /k npm run start -- -p 3005

echo.
echo Both servers initiated!
echo - Web Dashboard:  http://localhost:3005
echo - ML API & Docs:  http://127.0.0.1:8000/docs
echo.
echo Press any key to exit this launcher window (servers remain running)...
pause > nul
