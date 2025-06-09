#!/bin/bash

cd /home/pi/notoo

echo "[DEPLOY] Pulling latest changes..."
git pull origin main

echo "[DEPLOY] Building Docker containers..."
docker-compose build

echo "[DEPLOY] Restarting app..."
docker-compose up -d

echo "[DEPLOY] Done."