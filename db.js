var mysql = require("mysql");
var conf = require("./conf");

var pool;
var credentials;

if(process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES)['mysql-5.1'][0]['credentials'];
    credentials = {host: env.hostname, user: env.username, password: env.password, database: 'nodePortfolio'};
}
else {
    var credentials = {host: conf.db.host, user: conf.db.user, password: conf.db.password, database: conf.db.db, insecureAuth:true, multipleStatements: true};
}

pool = mysql.createPool(credentials);

exports.query = function(str, callback, id) {
	pool.getConnection(function(err, connection) {
		if(err){return callback(err);}
		connection.query(str, function(err, result) {
			if(err){return callback(err);}
			callback(err, result, id);
			connection.end();
		});
	});
};

exports.unpackData = function(data) {
	var str = '';
	for(field in data) {
		str += mysql.escapeId(field) + " = " + mysql.escape(data[field]) + ", ";
	}
	str = str.slice(0,-2);
	return str;
}