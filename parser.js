var fs = require('fs');

module.exports = exports = parsePoem;

var args = process.argv.slice(2);

if (!module.parent) {
  if (args < 1) {
    console.log('need something 2 parse');
    return;
  }

  var file =argvs[0];
  var outfile = (args.length >= 2)? args[1] : 'poem.js';
  parsePoem(file, outfile);
}

function parsePoem(file, outfile) {
  console.log('parsing poem: ' + file);

  var lines = fs.readFileSync(file).toString().split('\n');

  var parsed = {lines: []};
  lines.forEach(function(line) {
    var segments = line.split(' ||| ');
    if (segments.length != 4) return;

    var data = {
      line: segments[0],
      onset: parseFloat(segments[1]),
      duration: parseFloat(segments[2]),
      amplitude: parseFloat(segments[3])
    };

    parsed.lines.push(data);
  });

  var dataToWrite = 'window.poem = ' + JSON.stringify(parsed);

  fs.writeFileSync(outfile, dataToWrite);

  return parsed;
}
