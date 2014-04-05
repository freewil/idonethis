var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var program = require('commander');
var yaml = require('js-yaml');
var config;

program
  .command('*')
  .action(function(msg) {
    // create mail transport from YAML config file
    var transport = nodemailer.createTransport(config.transport, config.transportOpts);
    var mailOpts = {
      from: config.from,
      to: config.to,
      subject: 'idonethis',
      text: msg
    };

    // send the iDoneThis message!
    transport.sendMail(mailOpts, function(err, res) {
      if (err) console.error(err.toString());
      transport.close();
    });
  });

// parse args passed in from executable
exports.run = function(argv) {

  // read ~/.idonethis.yaml config file from user's home directory
  var configPath = path.join(process.env.HOME, '.idonethis.yaml');
  fs.readFile(configPath, function(err, buf) {
    if (err) {
      return console.error(err.toString());
    }

    // parse the YAML config file
    try {
      config = yaml.safeLoad(buf.toString('utf8'));
    } catch (e) {
      return console.error(e.toString());
    }

    // parse the cli command
    program.parse(process.argv);
  });
};
