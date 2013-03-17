//setup Dependencies
var http = require('http'),
    express = require('express'),
    app = express(),
    io = require('socket.io'),
    port = (process.env.PORT || 8081),
    everyauth = require('everyauth'),
    check = require('validator').check;

var emailer = require('./emailer'),
    contactMe = require('./models/contact-me');

var util = require('util');

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

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view options', { layout: false });
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "j3rM"}));
    app.use(express.static(__dirname + '/static'));
    app.use(everyauth.middleware());
    app.use(app.router);
    app.use(express.errorHandler());
 });
//setup the errors
// app.error(function(err, req, res, next){
//     if (err instanceof NotFound) {
//         res.render('404.jade', { locals: { 
//             title : '404 - Not Found'
//             ,description: ''
//             ,author: ''
//             ,analyticssiteid: 'XXXXXXX' 
//         },status: 404 });
//     } else {
//         res.render('500.jade', { locals: { 
//             title : 'The Server Encountered an Error'
//             ,description: ''
//             ,author: ''
//             ,analyticssiteid: 'XXXXXXX'
//             ,error: err 
//         },status: 500 });
//     }
// });
var server = http.createServer(app);
server.listen( port );

// Export server
server.testString = "test";



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
    socket.on('contact_post', function(data){
        try{
            check(data.contact.email).isEmail()
            contactMe.add(data.contact, function(rows){
                emailer.emailContactMe(data);
            });
        
        }
        catch(e){
            console.log("something is fishy... their email changed: " + e.message);
        }

    });
    socket.on('disconnect', function(){
        console.log('Client Disconnected.');
    });
});

if(server.address().address == '0.0.0.0'){
    app.socketAddress = '127.0.0.1';
}
else{
    app.socketAddress = server.address().address;
}
console.log('Listening on ' + app.socketAddress +":"+ port );

exports.app = app;

// Setup Routes
var routes = require('./routes');
var NotFound = routes.NotFound;
