#!/bin/bash

# Function to kill process on a port
kill_port() {
    PORT=$1
    echo "Checking port $PORT..."
    fuser -k -n tcp $PORT > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Stopped process on port $PORT."
    fi
}

# Cleanup existing processes
echo "Checking for running services..."
kill_port 3000
kill_port 4200

# Start Backend
echo "Starting Backend..."
cd server
npm start &
BACKEND_PID=$!

# Go back to root
cd ..

# Start Frontend
echo "Starting Frontend..."
npm start &
FRONTEND_PID=$!

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait for processes
wait

