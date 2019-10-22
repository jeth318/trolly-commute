const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;;
const childProcess = require('child_process');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const ora = require('ora');
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
	res.sendStatus(200);
	console.log('OK response sent to GitHub');
	console.log('Deploying application. This might take a few minutes...');
	return childProcess.exec('cd /home/pi/Apps/trolly-commute && ./deploy.sh', function(err, stdout, stderr){
		if (err) {
			console.log('WE HAVE ERR');
			console.error(err);
			spinner.stop();
			sendEmail({ subject: 'Failed to deploy to jtdev.se', text: err} );
		} else if (stderr) {
			console.log('WE HAVE STD-ERR');
			spinner.stop();
			console.error(stderr);
		} else {
			console.log('WE HAVE NO ERR');
			console.log(stdout);
			spinner.stop();
			sendEmail({ subject: 'Successful deploy to jtdev.se!', text: 'Application deployed correctly'});
		}
	});
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
