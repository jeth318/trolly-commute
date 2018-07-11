# BUILD APP FOR PRODUCTION ON SERVER. 
# RUN ---ONLY--- ON DIGITALOCEAN.

git pull
if [ -d "$node_modules" ]; then
  sudo rm -r node_modules
fi
npm i
cd client
if [ -d "$node_modules" ]; then
  sudo rm -r node_modules
fi
npm i
if [ -d "$build" ]; then
  sudo rm -r build
fi
npm run build
pm2 restart index.js --watch
echo "DONE!"