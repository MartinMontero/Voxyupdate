#!/bin/bash

# Voxy Deployment Script
set -e

echo "🚀 Starting Voxy deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before continuing."
    echo "   Required: ANTHROPIC_API_KEY, ELEVENLABS_API_KEY"
    read -p "Press Enter when you've updated the .env file..."
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads
mkdir -p backend/audio
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/qdrant

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API is not responding"
    docker-compose logs api
    exit 1
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
    docker-compose logs web
    exit 1
fi

echo ""
echo "🎉 Voxy is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""
echo "🔑 Don't forget to set your API keys in the .env file!"