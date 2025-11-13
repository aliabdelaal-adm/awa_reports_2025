@echo off
echo ========================================
echo    Admin Dashboard Server Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js installation...
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [2/3] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo [2/3] Dependencies already installed
)
echo.

echo [3/3] Starting admin server...
echo.
echo ========================================
echo Server will start on: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin-dashboard.html
echo Password: 1940
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

node admin-server.js

pause
