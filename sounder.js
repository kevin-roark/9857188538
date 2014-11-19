
module.exports = exports = soundParse;

var exec = require('child_process').exec;
var execSync = require('exec-sync');

var FILE_PREFIX = 'temp-sound-';

function soundParse(poem, name, verbose) {
  console.log('creatin sound now');

  if (!poem.whitespaceRatio) poem.whitespaceRatio = 0.44;
  if (!poem.distortion) poem.distortion = 0.15;

  var soxPipes =[];

  // parse each line
  for (var i = 0; i < poem.lines.length; i++) {
    var lineData = poem.lines[i];

    var spaceFreeLine = lineData.line.replace(/ /g,'');

    var characters = spaceFreeLine.split('');
    var numCharacters = characters.length;
    var numSilences = numCharacters - 1;

    var timeDeltaBetweenCharacters = lineData.duration / numCharacters;
    var whiteRatio = (lineData.ratio)? lineData.ratio : poem.whitespaceRatio;
    var durationRatio = numSilences == 0? 1.0 : (numCharacters / numSilences) * whiteRatio;
    var timePerCharacter = timeDeltaBetweenCharacters * durationRatio;

    var onset = lineData.onset;

    // parse each character in the line
    for (var j = 0; j < numCharacters; j++) {
      var char = characters[j];

      var soxPipe = soxPipeCommand(char, timePerCharacter, onset, lineData.amplitude, poem.distortion);

      if (soxPipe) {
        soxPipes.push(soxPipe);
      }

      onset += timeDeltaBetweenCharacters;
    }
  }

  // iterate over every pipe, writing an intermediate file at 100 pipe increments, and
  // collecting those file names
  var finalFiles = [' -v 1.0 '];
  var intermediateFiles = [];
  var currentFiles = [];
  for (var k = 0; k < soxPipes.length; k++) {
    var pipe = soxPipes[k];
    currentFiles.push(pipe);

    if (k != 0 && k % 250 == 0) {

      var mediaryFile = filename(intermediateFiles.length);
      var mediaryCommand = soxWriteCommand(currentFiles, mediaryFile, false);
      if (verbose) {
        console.log('writing mediary file for k ' + k);
      }

      execSync(mediaryCommand, true);
      intermediateFiles.push(mediaryFile);

      currentFiles = [];
    }
  }

  // add intermediate files to final files list
  intermediateFiles.forEach(function(file) {
    finalFiles.push(file);
  });

  // add any pipes that weren't swallowed in a mediary command to final file list
  currentFiles.forEach(function(pipe) {
    finalFiles.push(pipe);
  });

  // run the final command to comebine everything
  var finalCommand = soxWriteCommand(finalFiles, name, false, 'mix-power');
  if (verbose) console.log(finalCommand);
  execSync(finalCommand, true);
  console.log('finished writing sound file to!!!!  ' + name);

  // clean up the intermediate files
  intermediateFiles.forEach(function(file) {
    execSync('rm -f ' + file, true);
  });

  return finalCommand;
}

function soxWriteCommand(inputFiles, outfile, pipesOnly, specialMethod) {
  var command = commandStart(pipesOnly, specialMethod);

  inputFiles.forEach(function(file) {
    command += ' ' + file;
  });

  var file = pipesOnly? '-p "' : outfile;

  return command + ' ' + file + ' norm ';
}

function filename(i) {
  return FILE_PREFIX + i + '.mp3';
}

function commandStart(pipesOnly, specialMethod) {
  var method = specialMethod? specialMethod : 'mix';

  var command = pipesOnly? '"|sox ' : 'sox';

  command += ' --combine ' + method + ' ';

  return command;
}

function soxPipeCommand(character, duration, onset, amplitude, distortion) {
  var number = numberForCharacter(character);
  var tones = tonesForNumber(number);

  if (!tones) return null;

  var synth = ' synth ' + duration.toFixed(2) + ' sine ' + tones[0] + ' sine ' + tones[1] + ' channels 1 ';
  var pad = ' pad ' + onset.toFixed(2) + '@0:00 ';

  var maxGain = 16;
  var minGain = -2;
  var gainLevel = ((maxGain - minGain) * amplitude) + minGain;
  var gain = ' vol ' + gainLevel.toFixed(2) + ' ';

  var overdrive = ' overdrive ' + (distortion * 100).toFixed(2) + ' 50 ';

  var effects = [synth, overdrive, gain, pad].join(' ');

  return '"|sox -n -p ' + effects + ' "';
}

// http://en.wikipedia.org/wiki/Dual-tone_multi-frequency_signaling
function tonesForNumber(number) {
  var R1 = 697;
  var R2 = 770;
  var R3 = 852;
  var R4 = 941;

  var C1 = 1209;
  var C2 = 1336;
  var C3 = 1477;

  switch (number) {
    case 'one':
      return [R1, C1];

    case 'two':
      return [R1, C2];

    case 'three':
      return [R1, C3];

    case 'four':
      return [R2, C1];

    case 'five':
      return [R2, C2];

    case 'six':
      return [R2, C3];

    case 'seven':
      return [R3, C1];

    case 'eight':
      return [R3, C2];

    case 'nine':
      return [R3, C3];

    case 'star':
      return [R4, C1];

    case 'zero':
      return [R4, C2];

    case 'pound':
      return [R4, C3];

    default:
      return null;
  }
}

function numberForCharacter(char) {
  var c = char.toUpperCase();

  switch (c) {
    case '0':
    case '+':
      return 'zero';

    case '1':
      return 'one';

    case '2':
    case 'A':
    case 'B':
    case 'C':
      return 'two';

    case '3':
    case 'D':
    case 'E':
    case 'F':
      return 'three';

    case '4':
    case 'G':
    case 'H':
    case 'I':
      return 'four';

    case '5':
    case 'J':
    case 'K':
    case 'L':
      return 'five';

    case '6':
    case 'M':
    case 'N':
    case 'O':
      return 'six';

    case '7':
    case 'P':
    case 'Q':
    case 'R':
    case 'S':
      return 'seven';

    case '8':
    case 'T':
    case 'U':
    case 'V':
      return 'eight';

    case '9':
    case 'W':
    case 'X':
    case 'Y':
    case 'Z':
      return 'nine';

    case '*':
      return 'star';

    case '#':
      return 'pound';

    default:
      return null;
  }
}
