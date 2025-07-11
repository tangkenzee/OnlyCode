#!/bin/bash

echo "🚀 Starting Buddy Code Mentor Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔧 Starting server on http://localhost:3001"
echo "📊 API available at http://localhost:3001/api"
echo "🏥 Health check: http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run server:dev 