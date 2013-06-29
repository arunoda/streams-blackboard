Pad = function Pad(id) {
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

  pad.on('dragstart', function(event) {
    drawing = true;
    from = getPosition(event);
    LineStream.emit(id + ':dragstart', nickname, from, color);
  });

  pad.on('dragend', function() {  
    drawing = false;  
    LineStream.emit(id + ':dragend', nickname);
  });

  pad.on('drag', function(event) {  
    if(drawing) {
      var to = getPosition(event);
      drawLine(from, to, color);
      LineStream.emit(id + ':drag', nickname, to);
      from = to;
      skipCount = 0;
    }
  });

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
  
  function wipe() {
    ctx.fillRect(0, 0, canvas.width(), canvas.height());
  }
  
  ctx.strokeStyle = color;
  ctx.fillStyle = '#000000';
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  
  wipe();
  
  $('#wipe').on('click', function() {
    wipe();
    LineStream.emit(id + ':wipe', nickname);
  });

  $('#set-nickname').on('click', function() {
    var name = prompt('Enter your nickname');
    if(name && name.trim() != '') {
      setNickname(name);
    }
  });

  $('#create-new').on('click', function() {
    var newPadId = Random.id();
    Meteor.Router.to('pad', newPadId);
  });

  // Stop iOS from doing the bounce thing with the screen
  document.ontouchmove = function(event){
    event.preventDefault();
  }

  //expose API
  this.drawLine = drawLine;
  this.wipe = wipe;
  this.setNickname = setNickname;
  this.close = function() {};
}


function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
