var path = require('path'),
    templatesDir = path.resolve(__dirname, '.', 'templates'),
    emailTemplates = require('email-templates-windows'),
    nodemailer = require('nodemailer')
    credentials = require('./conf');

var util = require('util');

var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: credentials.emailerCred.user,
        pass: credentials.emailerCred.pass
    }
});

var emailContactMe = function(contactData){
    emailTemplates(templatesDir, function(err, template){
        if(err)
            console.log("emailTemplates: " + err);
        else{

            var locals = {
                email: contactData.contact.email,
                name: contactData.contact.name,
                org: contactData.contact.org,
                message: contactData.contact.message
                }

            template('contact_me', locals, function(err, html, text){
                console.log("in contact_me: " + util.inspect(html));
                if(err)
                    console.log('template: ' + err)
                else {
                    transport.sendMail({
                        from: 'Jeremy Bernstein <dr.jerm.io@gmail.com>',
                        to: 'Jeremy Bernstein <dr.jerm.io@gmail.com>',
                        subject: 'New message on your portfolio',
                        html: html,
                        text: text
                    }, function(err, responseStatus){
                        if(err)
                            console.log('sendMail: ' + err)
                        else{
                            console.log(responseStatus);
                        }
                    });
                }

            });
        }

    });    
    if(contactData.contact.eCard){

        emailTemplates(templatesDir, function(err, template){
            if(err)
                console.log("emailTemplates: " + err);
            else{

                var locals = {
                    email: contactData.contact.email,
                    name: contactData.contact.name,
                    org: contactData.contact.org,
                    message: contactData.contact.message
                    }
                    
                template('eCard', locals, function(err, html, text){
                    console.log("in eCard: " + util.inspect(html));
                    if(err)
                        console.log('template: ' + err)
                    else {
                        transport.sendMail({
                            from: 'Jeremy Bernstein <dr.jerm.io@gmail.com>',
                            to: contactData.contact.email,
                            subject: 'eCard from Jeremy Bernstein',
                            html: html,
                            text: text
                        }, function(err, responseStatus){
                            if(err)
                                console.log('sendMail: ' + err)
                            else{
                                console.log(responseStatus);
                            }
                        });
                    }

                });
            }
        });
    }
}

exports.emailContactMe = emailContactMe;