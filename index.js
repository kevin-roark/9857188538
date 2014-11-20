#!/usr/local/bin/node

var fs = require('fs');
var ncp = require('ncp').ncp;
var execFile = require('child_process').execFile;

var parser = require('./parser');
var sounder = require('./sounder');

var args = process.argv.slice(2);

ncp.limit = 16;

function processPoem(prefix, dirname) {
  console.log('readin poem: ' + prefix);

  if (!dirname) dirname = './poem';
  var poem = prefix + '.txt';

  fs.mkdirSync(dirname);

  var parsed = parser(poem, dirname + '/poem.js');
  sounder(parsed, dirname + '/poem.mp3');

  ncp(__dirname + '/boiler', dirname, function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

if (args.length < 1) {
  return console.log('need file prefix as first arg');
}

var prefix = args[0];

var dirname = null;
if (args.length > 1) dirname = args[1];

execFile('./clean.sh', function() {
  processPoem(prefix, dirname);
});
