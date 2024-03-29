#!/usr/bin/env bash
cd /home/pi/Apps/trolly-commute
echo "Stashing lock files"
git stash

echo "Dropping stash"
git stash drop

echo "Pulling from Master"
git pull origin master
echo "Pulled successfully from master"

echo "Installing server dependencies"
cd server
npm install
echo "Server dependencies installed"

echo "Installing client dependencies..."
cd ../client
npm install
echo "Client dependencies was installed"

echo "Rebuilding application"
npm run build

echo "Rebuild OK"
echo "Rebooting server"
pm2 restart TC-api
echo "Server rebooted OK"
echo "Deployment complete, and it was a success!"
exit 0
