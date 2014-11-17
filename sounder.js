
module.exports = exports = soundParse;

var exec = require('child_process').exec;

function soundParse(poem, name) {
  if (!poem.whitespaceRatio) poem.whitespaceRatio = 0.44;
  if (!poem.distortion) poem.distortion = 0.15;

  var command = commandStart();

  console.log(poem);

  // parse each line
  for (var i = 0; i < poem.lines.length; i++) {
    var lineData = poem.lines[i];

    var spaceFreeLine = lineData.line.replace(' ', '');

    var characters = spaceFreeLine.split('');
    var numCharacters = characters.length;
    var numSilences = numCharacters - 1;

    var timeDeltaBetweenCharacters = lineData.duration / numCharacters;

    var durationRatio = numSilences == 0? 1.0 : (numCharacters / Math.max(numSilences, 1)) * poem.whitespaceRatio;
    var durationWithoutWhitespace = lineData.duration * durationRatio;
    var timePerCharacter = durationWithoutWhitespace / numCharacters;

    var onset = lineData.onset;

    // parse each character in the line
    for (var j = 0; j < numCharacters; j++) {
      var char = characters[j];

      var sox = soxCommandForCharacter(char, timePerCharacter, onset, lineData.amplitude, poem.distortion);

      if (sox) command += ' ' + sox;

      onset += timeDeltaBetweenCharacters;
    }
  }

  // add the outfile name
  command += ' ' + name;

  // run the command
  exec(command, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('sound creation error: ' + error);
      }
      else {
        console.log('CREATED SOUND AT ' + name);
      }
  });

  console.log(command);

  return command;
}

function commandStart() {
  return 'sox --combine mix ';
}

function soxCommandForCharacter(character, duration, onset, amplitude, distortion) {
  var number = numberForCharacter(character);
  var tones = tonesForNumber(number);

  if (!tones) return null;

  var synth = ' synth ' + duration + ' sine ' + tones[0] + ' sine ' + tones[1] + ' channels 1 ';
  var pad = ' pad ' + onset + '@0:00 ';

  var maxGain = 12;
  var minGain = -5;
  var gainLevel = ((maxGain - minGain) * amplitude) + minGain;
  var gain = ' vol ' + gainLevel + ' ';

  var overdrive = ' overdrive ' + (distortion * 100) + ' 50 ';

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
