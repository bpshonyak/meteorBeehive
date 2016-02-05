Messages = new Mongo.Collection("messages");

Router.route('/', function () {
  this.render('guestBook');		// render the guestbook template
  this.layout('layout');    	// set the main layout template
});

Router.route('/about', function () {
  this.render('about'); 		// render the guestbook template
  this.layout('layout');    // set the main layout template
});

Router.route('/message/:id', function () {
      this.render('message', {
        data: function () {
          return Messages.findOne({
            _id: this.params.id
          });
        }
      }); 		// render the guestbook template
      this.layout('layout');    // set the main layout template
    },
    {
      name: 'message.show'
    }
);

if (Meteor.isClient) {

  Meteor.subscribe("messages");

  Template.guestBook.helpers(
      {
        "messages": function(){
          return Messages.find( {}, {sort: {createdOn: -1} } ) || {};
        },
        "formatDate": function(date){
          var newDate = moment(date).format('YYYY-MM-DD');
          console.log(newDate);
          return newDate;
        }
      }
  );

  Template.guestBook.events(
      {
        "submit form": function(event){
          event.preventDefault();

          var name = $(event.target).find("input[id = name]");
          var msg = $(event.target).find("textarea[id = message]");

          if(name.val().length > 0 && msg.val().length > 0){
            Messages.insert(
                {
                  name: name.val(),
                  message: msg.val(),
                  createdOn: Date.now()
                });

            name.val("");
            msg.val("");

            msg.removeClass("error");
            name.removeClass("error");

          } else {
            // TODO: remove redundancy
            if(msg.val().length < 1){
              msg.addClass("error");
            } else {
              msg.removeClass("error");
            }
            if(name.val().length < 1){
              name.addClass("error");
            } else {
              name.removeClass("error");
            }
          }

        }
      }
  );
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.publish("messages", function () {
      return Messages.find();
    });

  });
}
