#!/usr/bin/env bash
cd /home/Apps/trolly-commute

echo "Stashing lock files"

git stash

echo "Dropping stash"

git stash drop

echo "Pulling from Master"

git pull origin master

echo "Pulled successfully from master"

echo "Rebuilding application"

cd client

npm run build

echo "Rebuild complete"

echo "Restarting server..."

pm2 restart trolly-commute

echo "Server restarted Successfully"
