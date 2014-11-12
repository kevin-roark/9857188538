
var MIN_FONT = 12;
var MAX_FONT = 72;

var activeBodyClass = '';

window.poem.forEach(function(lineData) {
  handleLineData(lineData);
});

function handleLineData(lineData) {
  lineData.fontSize = ((MAX_FONT - MIN_FONT) * lineData.amplitude) + 'px';
  lineData.left = ($(window).width() * 0.6 * Math.random()) + 'px';
  lineData.top = ($(window).height() * 0.95 * Math.random()) + 'px';
  
  var line = $('<div class="poem">' + lineData.line + '</div>');
  line.css('font-size', lineData.fontSize);
  line.css('top', lineData.top);
  line.css('left', lineData.left);
  line.css('display', 'none');
  $('body').append(line);
  
  // come inside
  setTimeout(function() {
    line.fadeIn(200);
    
    // flashin
    var timePerCharacter = (lineData.duration * 1000) / lineData.line.length;
    for (var i = 0; i < lineData.line.length; i++) {
      var char = lineData.line.charAt(i);
      updateScreenForCharacter(char, timePerCharacter * i);
    }
    
    // go away
    setTimeout(function() {
      line.fadeOut(200);
    }, lineData.duration * 1000);
  }, lineData.onset * 1000);
}

function updateScreenForCharacter(char, delay) {
  var className = numberForCharacter(char);
  
  setTimeout(function() {
    if (activeBodyClass != className) $('body').removeClass(activeBodyClass);

    activeBodyClass = className;
    $('body').addClass(className);
  }, delay);
}

function numberForCharacter(char) {
  var c = char.toUpperCase();
  
  switch (c) {
    case '0':
    case '+':
    case ' ':
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
    default:
      return 'nine';
  }
}
