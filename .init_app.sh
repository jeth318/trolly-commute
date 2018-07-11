# BUILD APP FOR PRODUCTION ON SERVER. 
# RUN ---ONLY--- ON DIGITALOCEAN.

git pull
if [ ! -d "$node_modules" ]; then
  sudo rm -r node_modules
fi
npm i
cd client
if [ ! -d "$node_modules" ]; then
  sudo rm -r node_modules
fi
npm i
npm run build
echo "DONE!"