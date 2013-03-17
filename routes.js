// Routes.js

var app = require('./server').app,
    everyauth = require("everyauth"),
    videos = require('./static/js/videos').videos;

var util = require('util');

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

console.log(app.socketAddress);

app.get('/', function(req,res){
  res.render('index.jade', {  
    title : 'Jeremy Bernstein',
    description: 'A Web Portfolio',
    author: 'Jeremy Bernstein',
    serverAddress: app.socketAddress,
    videos: videos
  });
});

/*app.server.post('/', function(req, res) {

  if(req.body != undefined) {
    var receiver = req.body.receiver;
    var sender = req.body.sender;
    var story = req.body.story;

    user_story.model.findOne({ name: story }, function(err, doc) {
      doc.progress = receiver;
      doc.save();
    });
  }

});


app.server.post('/add', function(req, res) {

  if(req.body != undefined) {
    var name = req.body.name;
    var description = req.body.description;
    var pair_one = req.body.pair_one;
    var pair_two = req.body.pair_two;

    var us = new user_story.model({
      'name' : name,
      'description' : description,
      'pair': [pair_one, pair_two]
    });

    us.save(function(err, us) {
      res.redirect("/");
    });
  }

});
*/

//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

exports.NotFound = NotFound;