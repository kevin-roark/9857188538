var fs = require('fs');

if (process.argv.length < 1) {
  console.log('need something 2 parse');
  return;
}

var file = process.argv[0];
var lines = fs.readFileSync(file).toString().split('\n');

var parsed = [];

lines.forEach(function(line) {
  var segments = line.split(' ||| ');
  if (segments.length != 4) return;
  
  var data = {
    line: segments[0],
    onset: parseFloat(segments[1]),
    duration: parseFloat(segments[2]),
    amplitude: parseFloat(segments[3])
  };
  
  parsed.push(data);
});

var dataToWrite = 'window.poem = ' + JSON.stringify(parsed);

var outfile = (process.argv.length >= 2)? process.argv[1] : 'poem.js';
fs.writeFileSync(outfile, dataToWrite);
