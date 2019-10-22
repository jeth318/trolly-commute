const childProcess = require('child_process');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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
        console.log(data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log(data);
        data=data.toString();
        scriptOutput+=data;
    });

    child.on('exit', function(code) {
        callback(scriptOutput, code);
    });
}

function deploy(){
    console.log('Sent OK response sent to GitHub');
    console.log('Starting deployment. This might take a few minutes...');
    run_script('/home/pi/Apps/trolly-commute/deploy.sh', [], (scriptOut, code) => {
        if (code === 0) {
            return sendEmail({ subject: 'TrollyCommute was successfully deployed!', text: ''})
        } else {
            return sendEmail({ subject: 'Failed to deploy', text: data})
        }
    });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.JTDEV_DEPLOYBOT_EMAIL,
        pass: process.env.JTDEV_DEPLOYBOT_PASSWORD
    }
});

const mailOptions = (deploymentInfo) => {
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

module.exports = (res) => deploy(res);
