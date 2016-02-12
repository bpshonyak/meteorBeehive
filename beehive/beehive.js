BeeData = new Mongo.Collection("beedata");

Router.route('/home', function () {
  this.render('beeForm');
  this.layout('layout');
});

Router.route('/admin', function () {
  this.render('admin');
  this.layout('layout');
});

Router.route('/hive/:name', function () {
      this.render('hiveData', {});
      this.layout('layout');
    },
    {
      name: 'data.show'
    }
);

if (Meteor.isClient) {

  Meteor.subscribe("beedata");

  Template.admin.helpers(
      {
        "entries": function(){
          return BeeData.find( {}, {sort: {createdOn: -1} } ) || {};
        },
        "formatDate": function(date){
          var newDate = moment(date).format('YYYY-MM-DD');
          return newDate;
        }
      }
  );

  Template.hiveData.helpers(
      {
        "entries": function(){
          var id = Router.current().params.name;
          console.log(id);
          return BeeData.find( { hiveID: id}, {sort: {createdOn: -1} } ) || {};
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

          // Require all fields
          if(hiveID.val() > 0 && colDate.val().length > 0 && samplePeriod.val() > 0 && mites.val() > 0){
            BeeData.insert(
                {
                  hiveID: hiveID.val(),
                  colDate: colDate.val(),
                  samplePeriod: samplePeriod.val(),
                  mites: mites.val(),
                  createdOn: Date.now()
                });

            Router.go('data.show', {name: hiveID.val()});

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
