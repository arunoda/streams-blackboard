Meteor.Router.add({
  '/': function() {
    var newPadId = Random.id();
    location.href = '/' + newPadId;
  },

  '/:id': {
    as: 'pad',
    to: function(id) {
      Session.set('padId', id);
      return 'pad'
    }
  }
});