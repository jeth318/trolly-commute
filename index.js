const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;;
const https = require('https');
const childProcess = require('child_process');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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
			sendEmail({ subject: 'Failed to deploy to jtdev.se', text: err} );
			return res.sendStatus(500);
		} else {
			console.log(stdout);
			sendEmail({ subject: 'Successful deploy to jtdev.se!', text: 'Application deployed correctly'});
		}
	});
	console.log('OK response sent to GitHub');
	res.sendStatus(200);
}

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.JTDEV_DEPLOYBOT_EMAIL,
		pass: process.env.JTDEV_DEPLOYBOT_PASSWORD
	}
});

var mailOptions = (deploymentInfo) => {
		return {
			from: process.env.JTDEV_DEPLOYBOT_EMAIL,
			to: 'jesper.thornberg@me.com',
			subject: deploymentInfo.subject,
			text: deploymentInfo.text
	}
};

const sendEmail = deploymentInfo => transporter.sendMail(mailOptions(deploymentInfo), function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
});

// sendEmail({ subject: 'Successful deploy to jtdev.se!', text: 'Application deployed correctly'});
