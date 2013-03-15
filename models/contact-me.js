var db = require('../db');
var util = require('util');

var contactMe = function(data){
    if(data == null){data = {};}
    
    this.id = data.id == undefined ? null : data.id;
    this.name = data.name == undefined ? null : data.name;
    this.email = data.email == undefined ? null : data.email;
    this.org = data.org == undefined ? null : data.org;
    this.message = data.message == undefined ? null : data.message;
    this.date = data.date == undefined ? null : data.date;
    this.public = data.public == undefined ? null : data.public;
    
    return this;
}

//Should be a cached function in contactMe.controller.
contactMe.prototype.get = function(id, callback) {
    db.query("SELECT * FROM guestbook WHERE id = " + id + ";", function(err, rows){
        if(err){return callback(err);}
        else {
            this.id = rows[0].id;
            this.name = rows[0].name;
            this.email = rows[0].email;
            this.org = rows[0].org;
            this.message = rows[0].message;
            this.date = rows[0].date;
            this.public = rows[0].public;
            return callback(null, this);
        }
    });
}

exports.contactMe = contactMe;

exports.getAll = function(callback) {
    db.query("SELECT * FROM guestbook;", function(err, rows){
        if(err){console.log(err); return callback(err);}
        else {
            var contacts = [];
            for(i in rows){
                var row = rows[i];
                var contact = new contactMe(row);
                contacts.push(contact);
            }
            
            return callback(contacts);
        }
    });
};

exports.add = function(data, callback) {
    var str = 'INSERT INTO guestbook SET ' + db.unpackData(data) + ';' 
    db.query(str, function(err, rows){
        if(err){console.log(err); return callback(err);}
        else {
            return callback(rows);
        }
    })
};
