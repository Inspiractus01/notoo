#!/bin/sh
echo "Webhook triggered – deploying..."

cd /notoo || exit

echo "Pulling latest code..."
git pull origin main

echo "Restarting Docker containers..."
docker compose down
docker compose up --build -d

echo "Deploy hotový ✅"