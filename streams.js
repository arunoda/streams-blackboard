LineStream = new Meteor.Stream('lines');

if(Meteor.isServer) {
  var subscriptionPads = {};
  LineStream.on('pad', function(padId) {
    var subscriptionId = this.subscriptionId;
    subscriptionPads[subscriptionId] = padId;

    this.onDisconnect = function() {
      subscriptionPads[subscriptionId] = undefined;
    };
  });

  LineStream.permissions.read(function(event) {
    var matched = event.match(/(.*):/);
    if(matched) {
      var padId = matched[1];
      return subscriptionPads[this.subscriptionId] == padId;
    } else {
      //only allows events with padId to read from the stream
      return false;
    }
  }, false);

  LineStream.permissions.write(function(event) {
    return true;
  });
}