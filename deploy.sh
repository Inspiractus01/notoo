#!/bin/sh

cd /home/pi/notoo
echo "📦 Pulling latest code from GitHub..."
git pull origin main

echo "🐳 Building Docker containers..."
docker compose build

echo "🚀 Starting containers..."
docker compose up -d

echo "✅ Deployment finished!"