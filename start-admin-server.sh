#!/bin/bash

echo "========================================"
echo "   Admin Dashboard Server Startup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    echo ""
    exit 1
fi

echo "[1/3] Checking Node.js installation..."
node --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[2/3] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
else
    echo "[2/3] Dependencies already installed"
fi
echo ""

echo "[3/3] Starting admin server..."
echo ""
echo "========================================"
echo "Server will start on: http://localhost:3000"
echo "Admin Dashboard: http://localhost:3000/admin-dashboard.html"
echo "Password: 1940"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node admin-server.js
