const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const runDeployment = require('./deployWorker');

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', port);
app.use(express.static(__dirname + '/client/build'));
app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html')
	.sendFile(path.join(__dirname, '/client/build/index.html'))
});

// GitHub push webhook
app.post("/webhooks", function (req, res) {
	const sender = req.body.sender;
	const branch = req.body.ref;
	const githubUsername = 'jeth318';

	if(branch.indexOf('master') > -1 && sender.login === githubUsername){
		res.sendStatus(200);
		runDeployment(res);
	}
});
