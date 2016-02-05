BeeData = new Mongo.Collection("beedata");

Router.route('/', function () {
  this.render('beeForm');		// render the guestbook template
  this.layout('layout');    	// set the main layout template
});

Router.route('/about', function () {
  this.render('about'); 		// render the guestbook template
  this.layout('layout');    // set the main layout template
});

Router.route('/data/:id', function () {
      this.render('message', {
        data: function () {
          return BeeData.findOne({
            _id: this.params.id
          });
        }
      }); 		// render the guestbook template
      this.layout('layout');    // set the main layout template
    },
    {
      name: 'data.show'
    }
);

if (Meteor.isClient) {

  Meteor.subscribe("beedata");

  Template.beeForm.helpers(
      {
        "entries": function(){
          return BeeData.find( {}, {sort: {createdOn: -1} } ) || {};
        },
        "formatDate": function(date){
          var newDate = moment(date).format('YYYY-MM-DD');
          console.log(newDate);
          return newDate;
        }
      }
  );

  Template.beeForm.events(
      {
        "submit form": function(event){
          event.preventDefault();

          var hiveID = $(event.target).find("input[id = hiveID]");
          var colDate = $(event.target).find("input[id = colDate]");
          var samplePeriod = $(event.target).find("input[id = samplePeriod]");
          var mites = $(event.target).find("input[id = mites]");

          if(hiveID.val() > 0){
            BeeData.insert(
                {
                  hiveID: hiveID.val(),
                  colDate: colDate.val(),
                  samplePeriod: samplePeriod.val(),
                  mites: mites.val(),
                  createdOn: Date.now()
                });

            hiveID.val("");
            colDate.val("");
            samplePeriod.val("");
            mites.val("");

          }

        }
      }
  );
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.publish("beedata", function () {
      return BeeData.find();
    });

  });
}
