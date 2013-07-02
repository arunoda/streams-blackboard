var pad;
var remoteUser;

Meteor.startup(function() {
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

$(function() {
  $('body').on('click', '#wipe', function() {
    pad.wipe(true);
  });

  $('body').on('click', '#set-nickname', function() {
    var name = prompt('Enter your nickname');
    if(name && name.trim() != '') {
      pad.setNickname(name);
    }
  });

  $('body').on('click', '#create-new', function() {
    var newPadId = Random.id();
    Meteor.Router.to('pad', newPadId);
  });
});