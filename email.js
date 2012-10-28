#!/usr/bin/env node

var nodemailer = require('nodemailer')
	, cli = require('optimist').default('config', process.env['HOME'] + '/.emailrc')  	
	.usage("Usage: $0 -s [subject] -b [body] -t [to] -u [ gmail account ]'")
  .alias('s', 'subject')
	.alias('b', 'body')
	.alias('t', 'to')
	.alias('a', 'attach')
	.alias('g', 'group')
	.alias('v', 'verbose')
	.alias('u', 'user')	
	.argv
 , fs = require('fs')
 , config = JSON.parse(fs.readFileSync(cli.config, 'utf8'))

function attach(options) {	
	var attachments = []
	if( cli.attach ) {
		var attached = {
			fileName: cli.attach.substring(cli.attach.lastIndexOf("/") + 1),
			streamSource: fs.createReadStream(cli.attach) 
		};
		attachments.push(attached) 
	}
	options.attachments = attachments
	return options 	
}

function to(options) {
	if( !cli.to && !cli.group ) return exit("Do you want to send this message to whom ? Use -t < email > or -g <group name> ")

	var destination = []
	if(cli.to) destination.push(Array.isArray(cli.to) ? cli.to.join(",") : cli.to )
	if( cli.group ) destination.push(parseGroup()) 
	options.to = destination.join(",")
	return options

	function parseGroup() {
		var names = Array.isArray(cli.group) ? cli.group : [cli.group] 
		var emails = [] 
		names.forEach(function(key, index){
			var gEmails = config.groups[key]
			if(gEmails == undefined || gEmails == null ) {
				exit("Are you sure that this group "+ key + " exist ? update your .emailrc ")
			}
			emails.push(gEmails.join(","))
		})
		return emails.join(",")
	}
}

function body(options) {
	var body = ( cli.body || "" ) + "\n\n\n\n Sent by your faithful employee climailer" 
	options.text = body
	return options
}

function from(options){
	var from = config.me;
	if(from) options.from = from
	return options
}

function subject(options) {
	options.subject = cli.subject || "Sorry, I forgot the subject, again !!"  
	return options
}

function buildOptions(){
	var options = {} 
	to(options)
	body(options)
	subject(options)
	attach(options)
	from(options)
	if(cli.verbose) console.log( JSON.stringify(options, null, 3)  )
	return options
}

function main() {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.setRawMode(true)  
	process.stdout.write("Password: ")
	var password = "";
	process.stdin.on('data', function (char) {
		char = char + ""
		switch (char) {
			case "\n": 
			case "\r": 
			case "\u0004":
  			process.stdin.setRawMode(false) 
	  		process.stdin.pause()
		  	send({ user: (cli.user || config.user) , pass: password}) 
			break
			case "\u0003":
			  process.exit()
			break
			default:
			  password += char
			break
		}
	});
}

function exit(message){
	process.stdout.write(message)
	process.exit()
}

function sparkle(interval){
	if(interval) return clearInterval(interval);

	process.stdout.write("\r\n")
	function fullStar(char){
		var full = " ★ "
		process.stdout.write("\r"+ char + full)
		return emptyStar
	}

	function emptyStar(char){
		var empty =" ☆ "
		process.stdout.write("\r" + char + empty)
		return fullStar
	} 

	var blink = fullStar
	, dots = ""

	return setInterval(function() {
		blink = blink(dots)
		dots += "."
		}, 800);

}

function send(auth) {
	var smtpTransport = nodemailer.createTransport("SMTP",{ service: "Gmail", auth: auth });
	var started = sparkle()
	smtpTransport.sendMail(buildOptions(), function(error, response){
		sparkle(started)
		if(error){ 
			console.log(" ✘ ")
			console.log("\n-== Error ==-\n" + JSON.stringify(error, null , 4))
		}else{ 
			console.log(" ✔ ")
		}
		smtpTransport.close(); 
	});
}

main();
