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


console.log("Node Version: ", process.version);

// This function will output the lines from the script
// AS is runs, AND will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(command, args, callback) {
	console.log("Starting Process.");
	var child = childProcess.spawn(command, args);

	var scriptOutput = "";

	child.stdout.setEncoding('utf8');
	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);

		data=data.toString();
		scriptOutput+=data;
	});

	child.stderr.setEncoding('utf8');
	child.stderr.on('data', function(data) {
		console.log('stderr: ' + data);
		sendEmail({ subject: 'Failed to deploy', text: data})
		data=data.toString();
		scriptOutput+=data;
	});

	child.on('close', function(code) {
		callback(scriptOutput,code);
	});

	child.on('exit', function(code) {
		callback(scriptOutput,code);
	});
}


function deploy(res){
	res.sendStatus(200);
	console.log('OK response sent to GitHub');
	console.log('Starting deployment. This might take a few minutes...');
	run_script('/home/pi/Apps/trolly-commute/deploy.sh', [], (scriptOut, code) => {
		sendEmail({ subject: 'Deploy OK!', text: 'yey'});
		console.log('SCRIPT_OUT__________', scriptOut);
		console.log('CODE******************', code);
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
