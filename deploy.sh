#!/bin/bash

set -e  # ak sa niečo pokazí, skript sa okamžite zastaví

echo "🔍 Checking Git branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️ Not on 'main' branch. Switching..."
  git checkout main
fi

echo "🔄 Pulling latest changes from Git..."
git pull origin main

echo "📦 Building updated containers (using cache)..."
docker compose build

echo "🔁 Restarting containers with updated images..."
docker compose up -d

echo "✅ Deployment complete without downtime!"