
var MIN_FONT = 6;
var MAX_FONT = 84;
var MAX_AGG = 5;
var MIN_AGG = 0;
var FONT_AGG_MULT = 1.1;
var DEFAULT_INTERVAL = 800;

var audio = document.querySelector('#audio');
audio.addEventListener('canplaythrough', function() {
  start();
});

var activeLines = {};
var activeLineCount = 0;
var activeBodyClass = '';
var justSetBodyColor = false;

var numLines = window.poem.lines.length;
var linesFaded = 0;

function start() {
  var firstLineData = window.poem.lines[0];
  audio.play();

  window.poem.lines.forEach(function(lineData) {
    handleLineData(lineData);
  });

  checkActiveLines();
};

function checkActiveLines() {

  function check() {
    var interval = DEFAULT_INTERVAL / Math.min(activeLineCount, 1);

    if (justSetBodyColor) {
      justSetBodyColor = false;
      interval = 500;
    }
    else if (activeLineCount > 1) {
      var lines = [];
      for (var line in activeLines) {
          if (!activeLines.hasOwnProperty(line)) continue;
          lines.push(activeLines[line]);
      }

      var randomLine = lines[Math.floor(Math.random() * lines.length)];
      if (randomLine) updateBodyCss(randomLine);
    }

    setTimeout(check, interval);
  }

  check();
}

function handleLineData(lineData) {
  lineData.fontSize = ((MAX_FONT - MIN_FONT) * lineData.amplitude) + MIN_FONT;
  lineData.aggressiveness = (lineData.amplitude > 0.5)? (MAX_AGG - MIN_AGG) * 2 * (lineData.amplitude - 0.5) : 0;
  lineData.left = ($(window).width() * 0.65 * Math.random());
  lineData.top = ($(window).height() * 0.8 * Math.random());

  var line = $('<div class="poem">' + lineData.line + '</div>');
  updateCssForLine(line, lineData);
  line.css('display', 'none');
  $('body').append(line);
  lineData.div = line;

  // come inside
  setTimeout(function() {
    activeLines[lineData.line] = lineData;
    activeLineCount += 1;
    line.fadeIn(200);

    // flashin
    var spaceFreeLine = lineData.line.replace(/ /g,'');

    var characters = spaceFreeLine.split('');
    var numCharacters = characters.length;
    var numSilences = numCharacters - 1;

    var timeDeltaBetweenCharacters = (lineData.duration / numCharacters) * 1000;
    var whiteRatio = (lineData.ratio)? lineData.ratio : window.poem.whitespaceRatio;
    var durationRatio = numSilences == 0? 1.0 : (numCharacters / numSilences) * whiteRatio;

    var timePerCharacter = timeDeltaBetweenCharacters * durationRatio;
    lineData.timePerCharacter = timePerCharacter;

    var trueCharCount = 0;
    for (var i = 0; i < lineData.line.length; i++) {
      if (lineData.line.charAt(i) == ' ') continue;

      updateScreenForCharacter(lineData, i, timeDeltaBetweenCharacters * trueCharCount);
      trueCharCount += 1;
    }

    var aggInterval = setInterval(function() {
      lineData.top += aggressivePositionDelta(lineData);
      lineData.left += aggressivePositionDelta(lineData);
      lineData.fontSize += (Math.random() - 0.5) * FONT_AGG_MULT * lineData.aggressiveness;

      sanitizeLineData(lineData);
      updateCssForLine(line, lineData);
    }, 30);

    // go away
    setTimeout(function() {
      activeLines[lineData.line] = null;
      activeLineCount -= 1;
      clearInterval(aggInterval);
      line.fadeOut(200);

      linesFaded += 1;
      if (linesFaded == numLines) {
        setTimeout(endgame, 200);
      }
    }, lineData.duration * 1000);
  }, lineData.onset * 1000);
}

function endgame() {
  $('body').removeClass(activeBodyClass);

  $('body').addClass('over');
}

function aggressivePositionDelta(lineData) {
  return Math.floor((Math.random() - 0.5) * 2 * lineData.aggressiveness);
}

function updateCssForLine(line, lineData) {
  line.css('font-size', lineData.fontSize + 'px');
  line.css('top', lineData.top + 'px');
  line.css('left', lineData.left + 'px');
}

function sanitizeLineData(lineData) {
  if (lineData.fontSize < 5) lineData.fontSize = 5;
  if (lineData.fontSize > 200) lineData.fontSize = 200;

  if (lineData.left < 0) lineData.left = 0;
  if (lineData.left > $(window).width()) lineData.left = $(window).width();

  if (lineData.top < 0) lineData.top = 0;
  if (lineData.top > $(window).height()) lineData.top = $(window).height();
}

function updateScreenForCharacter(lineData, index, delay) {
  var char = lineData.line.charAt(index);
  if (char == ' ') return;

  var preChar = lineData.line.substring(0, index);
  var postChar = lineData.line.substring(index + 1);

  setTimeout(function() {
    justSetBodyColor = true;
    lineData.activeIndex = index;
    updateBodyCss(lineData);

    lineData.div.html(preChar + '<span style="text-decoration: underline">' + char + '</span>' + postChar);
  }, delay);
}

function updateBodyCss(lineData) {
  var char = lineData.line.charAt(lineData.activeIndex);
  var className = numberForCharacter(char);

  if (activeBodyClass != className) $('body').removeClass(activeBodyClass);
  activeBodyClass = className;
  $('body').addClass(className);
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
