var mongoose = require('mongoose');

if(process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var mongo = env['mongodb-1.8'][0]['credentials'];
}
else {
	console.log("LOCAL");
	var mongo = {
		"hostname": "localhost",
		"port": 27017,
		"username": "",
		"password": "",
		"name": "",
		"db": "agile"
	}
}

var generate_mongo_url = function(obj) {
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'test');

	if(obj.username && obj.password) {
		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
	else {
		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
}

murl = generate_mongo_url(mongo);
mongoose.connect(murl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error!'));
db.once('open', function callback () {
  console.log("Connected!");
});

exports.db = db;