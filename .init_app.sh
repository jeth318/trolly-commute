# BUILD APP FOR PRODUCTION ON SERVER. 
# RUN ---ONLY--- ON DIGITALOCEAN.

git pull
sudo rm -r node_modules
npm i
cd client
sudo rm -r node_modules
npm i
npm run build
echo "DONE!"