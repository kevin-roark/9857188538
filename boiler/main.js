
var MIN_FONT = 12;
var MAX_FONT = 72;
var MAX_AGG = 5;
var MIN_AGG = 0;
var FONT_AGG_MULT = 2;

var audio = document.querySelector('#audio');
audio.addEventListener('canplaythrough', function() {
  audio.play();
  start();
});

var activeBodyClass = '';

var numLines = window.poem.length;
var linesFaded = 0;

function start() {
  window.poem.forEach(function(lineData) {
    handleLineData(lineData);
  });
};

function handleLineData(lineData) {
  lineData.fontSize = ((MAX_FONT - MIN_FONT) * lineData.amplitude);
  lineData.aggressiveness = (lineData.amplitude > 0.5)? (MAX_AGG - MIN_AGG) * 2 * (lineData.amplitude - 0.5) : 0;
  lineData.left = ($(window).width() * 0.64 * Math.random());
  lineData.top = ($(window).height() * 0.88 * Math.random());

  var line = $('<div class="poem">' + lineData.line + '</div>');
  updateCssForLine(line, lineData);
  line.css('display', 'none');
  $('body').append(line);
  lineData.div = line;

  // come inside
  setTimeout(function() {
    line.fadeIn(200);

    // flashin
    var timePerCharacter = (lineData.duration * 1000) / lineData.line.length;
    for (var i = 0; i < lineData.line.length; i++) {
      updateScreenForCharacter(lineData, i, timePerCharacter * i);
    }

    var aggInterval = setInterval(function() {
      lineData.top += Math.floor((Math.random() - 0.5) * 2 * lineData.aggressiveness);
      lineData.left += Math.floor((Math.random() - 0.5) * 2 * lineData.aggressiveness);
      lineData.fontSize += (Math.random() - 0.5) * FONT_AGG_MULT * lineData.aggressiveness;

      sanitizeLineData(lineData);
      updateCssForLine(line, lineData);
    }, 30);

    // go away
    setTimeout(function() {
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

function updateCssForLine(line, lineData) {
  line.css('font-size', lineData.fontSize + 'px');
  line.css('top', lineData.top + 'px');
  line.css('left', lineData.left + 'px');
}

function sanitizeLineData(lineData) {
  if (lineData.fontSize < 6) lineData.fontSize = 6;
  if (lineData.fontSize > 200) lineData.fontSize = 200;

  if (lineData.left < 0) lineData.left = 0;
  if (lineData.left > $(window).width()) lineData.left = $(window).width();

  if (lineData.top < 0) lineData.top = 0;
  if (lineData.top > $(window).height()) lineData.top = $(window).height();
}

function updateScreenForCharacter(lineData, index, delay) {
  var preChar = lineData.line.substring(0, index);
  var char = lineData.line.charAt(index);
  var postChar = lineData.line.substring(index + 1);

  var className = numberForCharacter(char);

  setTimeout(function() {
    if (activeBodyClass != className) $('body').removeClass(activeBodyClass);

    activeBodyClass = className;
    $('body').addClass(className);

    lineData.div.html(preChar + '<span style="text-decoration: underline">' + char + '</span>' + postChar);
  }, delay);
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
