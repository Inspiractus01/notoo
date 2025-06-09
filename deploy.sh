#!/bin/bash

echo "🔍 Checking Git branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️ Not on 'main' branch. Switching..."
  git checkout main || exit 1
fi

echo "🔄 Pulling latest changes from Git..."
git pull origin main || exit 1

echo "🐳 Rebuilding and restarting containers..."
docker compose down
docker compose up -d --build

echo "✅ Deployment complete!"