#!/bin/bash

echo "🔄 Pulling latest changes from Git..."
git pull origin main

echo "🐳 Rebuilding and restarting containers..."
docker compose down
docker compose up -d --build

echo "✅ Deployment complete!"