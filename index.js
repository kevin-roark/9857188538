#!/usr/local/bin/node

var fs = require('fs');
var ncp = require('ncp').ncp;
var execFile = require('child_process').execFile;

var parser = require('./parser');
var sounder = require('./sounder');

var args = process.argv.slice(2);

ncp.limit = 16;

function processPoem(prefix) {
  console.log('readin poem: ' + prefix);

  var dirname = './poem';
  var poem = prefix + '.txt';
  var song = prefix + '.mp3';

  fs.mkdirSync(dirname);

  var parsed = parser(poem, dirname + '/poem.js');
  sounder(parsed, dirname + '/poem.mp3');

  // ncp(song, dirname + '/poem.mp3', function(err) {
  //   if (err) console.log('ERROR WRITING MP3: ' + err);
  // });

  ncp(__dirname + '/boiler', dirname, function(err) {
    if (err) {
      return console.error(err);
    }

    console.log('HANDLED THE BOILER DATA');
  });
}

if (args.length < 1) {
  console.log('need file thing as first arg');
  return;
}


var prefix = args[0];

execFile('./clean.sh', function() {
  processPoem(prefix);
});
