//setup Dependencies
var connect = require('connect'), 
    express = require('express'),
    io = require('socket.io'),
    port = (process.env.PORT || 8081),
    everyauth = require('everyauth');

// var usersById = {};
// var usersByGithubId = {};
// var nextUserId = 0;

// function addUser (source, sourceUser) {
//   var user;
//   if (arguments.length === 1) { // password-based
//     user = sourceUser = source;
//     user.id = ++nextUserId;
//     return usersById[nextUserId] = user;
//   } else { // non-password-based
//     user = usersById[++nextUserId] = {id: nextUserId};
//     user[source] = sourceUser;
//   }
//   return user;
// }

// everyauth.everymodule.findUserById( function (id, callback) {
//     callback(null, usersById[id]);
// });

// everyauth.github
//   .appId(conf.github.appid)
//   .appSecret(conf.github.appsecret)
//   .entryPath('/login')
//   .callbackPath('/auth/github/callback')
//   .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
//     return usersByGithubId[githubUserMetadata.id] || (usersByGithubId[githubUserMetadata.id] = addUser('github', githubUserMetadata));
//   })
//   .redirectPath('/');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "j3rM"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(everyauth.middleware());
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port );

// Export server
server.testString = "test";
exports.server = server;

// Setup Routes
var routes = require('./routes');
var NotFound = routes.NotFound;

//Setup Socket.IO
var io = io.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    console.log("Client message: " + data)
    // socket.broadcast.emit('server_message',data);
    // socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

if(server.address().address == '0.0.0.0'){
  server.socketAddress = '127.0.0.1';
}
else{
  server.socketAddress = server.address().address;
}
console.log('Listening on ' + server.socketAddress +":"+ port );
