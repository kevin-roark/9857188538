var fs = require('fs');

module.exports = exports = parsePoem;

var args = process.argv.slice(2);

if (!module.parent) {
  if (args < 1) {
    return console.log('need something 2 parse');
  }

  var file = argvs[0];
  var outfile = (args.length >= 2)? args[1] : 'poem.js';
  parsePoem(file, outfile);
}

function parsePoem(file, outfile) {
  console.log('parsin poem: ' + file);

  var lines = fs.readFileSync(file).toString().split('\n');

  var parsed = {lines: [], distortion: 0.15, whitespaceRatio: 0.44};

  lines.forEach(function(line) {
    if (line.length == 0) return;

    if (line.indexOf('RATIO - ') != -1) {
      parsed.whitespaceRatio = parseFloat(line.split(' - ')[1]);
    }
    else if (line.indexOf('DISTORT - ') != -1) {
      parsed.distortion = parseFloat(line.split(' - ')[1]);
    }
    else {
      var segments = line.split(', ');
      if (segments.length < 1) return;
      
      if (segments.length < 2) {
        segments.push(0.0);
      }
      else {
        if (segments[1].charAt(0) == '+') {
          var lastLine = parsed.lines[parsed.lines.length - 1];
          segments[1] = parseFloat(segments[1].substring(1) + lastLine.onset);
        }
      }

      if (segments.length < 3) segments.push(10.0);

      if (segments.length < 4) segments.push(1.0);

      var data = {
        line: segments[0],
        onset: parseFloat(segments[1]),
        duration: parseFloat(segments[2]),
        amplitude: parseFloat(segments[3])
      };

      if (segments.length > 4) {
        data.ratio = parseFloat(segments[4]);
      }

      parsed.lines.push(data);
    }
  });

  var dataToWrite = 'window.poem = ' + JSON.stringify(parsed);

  fs.writeFileSync(outfile, dataToWrite);

  return parsed;
}
