#!/bin/sh

echo "📦 Deploy webhook spustený: $(date)" >> /tmp/deploy.log
cd /home/pi/notoo || exit 1

git pull origin main >> /tmp/deploy.log 2>&1
docker compose build >> /tmp/deploy.log 2>&1
docker compose up -d >> /tmp/deploy.log 2>&1
echo "✅ Hotovo!" >> /tmp/deploy.log