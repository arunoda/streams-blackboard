Meteor.startup(function() {
  var pad;
  var remoteUser;
  Deps.autorun(function() {
    if(pad) {
      pad.close();
      remoteUser.close();
    }

    var padId = Session.get('padId');
    pad = new Pad(padId);
    remoteUser = new RemoteUser(padId, pad);
  });
});