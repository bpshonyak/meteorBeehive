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


//CSV file download source: http://stackoverflow.com/questions/27238457/creating-a-csv-file-from-a-meteor-js-collection
//Package used: https://atmospherejs.com/harrison/papa-parse
Router.route('/export', {
  where: 'server',
  action: function () {
    var filename = 'bee_data.csv';

    var records = BeeData.find().fetch();
    var fileData =  Papa.unparse(records);

    var headers = {
      'Content-type': 'text/csv',
      'Content-Disposition': "attachment; filename=" + filename
    };

    // build a CSV string. Oversimplified. You'd have to escape quotes and commas.
    records.forEach(function(rec) {
      fileData += rec.Name + "," + rec.Address + "," + rec.Description + "\r\n";
    });
    this.response.writeHead(200, headers);
    return this.response.end(fileData);
  }
});

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
