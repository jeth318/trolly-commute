const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;;
const https = require('https');
const childProcess = require('child_process');

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
console.log('Yo');

app.set('port', port);
app.use(express.static(__dirname + '/client/build'));

app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html')
	.sendFile(path.join(__dirname, '/client/build/index.html'))
});


app.post("/webhooks", function (req, res) {
	var sender = req.body.sender;
	var branch = req.body.ref;
	var githubUsername = 'jeth318';

	if(branch.indexOf('master') > -1 && sender.login === githubUsername){
		deploy(res);
	}
});

function deploy(res){
	childProcess.exec('cd /home/pi/Apps/trolly-commute && ./deploy.sh', function(err, stdout, stderr){
		if (err) {
			console.error(err);
			return res.send(500);
		}
		res.send(200);
	});
}
/*
setInterval(function() {
	https.get("https://trolly-commute.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

*/
