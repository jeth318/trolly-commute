#!/usr/bin/env bash
cd /home/pi/Apps/trolly-commute

echo "Stashing lock files"

git stash

echo "Dropping stash"

git stash drop

echo "Pulling from Master"

git pull origin master

echo "Pulled successfully from master"

echo "Rebuilding application"

npm run deploy

echo "Rebuild complete"

exit 0;
