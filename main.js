
var MIN_FONT = 12;
var MAX_FONT = 72;

window.poem.forEach(function(lineData) {
  lineData.fontSize = ((MAX_FONT - MIN_FONT) * lineData.amplitude) + 'px';
  
  setTimeout(function() {
    
    
    setTimeout(function() {
    
    }, lineData.duration * 1000);
  }, lineData.onset * 1000);
});
