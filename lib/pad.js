if(!Meteor.isClient) return;

this.Pad = function Pad(id) {
  var canvas = $('canvas');
  var ctx = canvas[0].getContext('2d');
  var drawing = false;
  var from;
  var skipCount = 0;
  var nickname;
  var color;

  setNickname(localStorage.getItem('nickname') || Random.id());

  //send padid to the sever
  LineStream.emit('pad', id);
  
  var pad = canvas.attr({
    width: $(window).width(),
    height: $(window).height()
  }).hammer()

  pad.on('dragstart', onDragStart);
  pad.on('dragend', onDragEnd);
  pad.on('drag', onDrag);

  function onDrag(event) {  
    if(drawing) {
      var to = getPosition(event);
      drawLine(from, to, color);
      LineStream.emit(id + ':drag', nickname, to);
      from = to;
      skipCount = 0;
    }
  }

  function onDragStart(event) {
    drawing = true;
    from = getPosition(event);
    LineStream.emit(id + ':dragstart', nickname, from, color);
  }

  function onDragEnd() {  
    drawing = false;  
    LineStream.emit(id + ':dragend', nickname);
  }

  function getPosition(event) {
    return {x: parseInt(event.gesture.center.pageX), y: parseInt(event.gesture.center.pageY)};
  }

  function drawLine(from, to, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.closePath();
    ctx.stroke();
  }

  function setNickname(name) {
    nickname = name;
    $('#show-nickname b').text(nickname);
    localStorage.setItem('nickname', nickname);

    color = localStorage.getItem('color-' + nickname);
    if(!color) {
      color = getRandomColor();
      localStorage.setItem('color-' + nickname, color);
    }
  }
  
  function wipe(emitAlso) {
    ctx.fillRect(0, 0, canvas.width(), canvas.height());
    if(emitAlso) {
      LineStream.emit(id + ':wipe', nickname);
    }
  }
  
  ctx.strokeStyle = color;
  ctx.fillStyle = '#000000';
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  
  ctx.fillRect(0, 0, canvas.width(), canvas.height());

  // Stop iOS from doing the bounce thing with the screen
  document.ontouchmove = function(event){
    event.preventDefault();
  }

  //expose API
  this.drawLine = drawLine;
  this.wipe = wipe;
  this.setNickname = setNickname;
  this.close = function() {
    pad.off('dragstart', onDragStart);
    pad.off('dragend', onDragEnd);
    pad.off('drag', onDrag);
  };
}


function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
