#!/bin/bash

echo "🚀 Starting OnlyCode Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please make sure you're in the project root."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start the backend server
echo "🔧 Starting backend server on http://localhost:3001"
echo "📡 WebSocket server on ws://localhost:3002"
echo "📊 API available at http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev