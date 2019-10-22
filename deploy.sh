#!/usr/bin/env bash
cd /home/Apps/trolly-commute

echo "Pulling from Master"

git pull origin master

echo "Pulled successfully from master"

echo "Rebuilding application"

npm start

echo "Rebuild complete"

echo "Restarting server..."

pm2 restart trolly-commute

echo "Server restarted Successfully"
