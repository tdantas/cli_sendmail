#!/usr/bin/env node

var fs = require('fs')
var nodemailer = require('nodemailer')
, cli = require('optimist').default('config', process.env['HOME'] + '/.emailrc')   
.usage("Usage: $0 -s [subject] -b [body] -t [to] -u [ gmail account ]'")
.alias('s', 'subject')
.alias('b', 'body')
.alias('t', 'to')
.alias('a', 'attach')
.alias('g', 'group')
.alias('l','listgroups')
.alias('v', 'verbose')
.alias('u', 'user')
.argv

var growl = require('growl')

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
  if(cli.to) destination.push( Array.isArray(cli.to) ? cli.to.join(",") : cli.to )
    if( cli.group ) destination.push( parseGroup(cli.group) ) 
      options.to = destination.join(",")
    return options

    function parseGroup(group) {
      var names = Array.isArray(group) ? group : [group] 
      var emails = [] 
      names.forEach(function(key, index){
        var gEmails = options.config.groups[key]

        if(gEmails == undefined || gEmails == null ) {
          exit("Are you sure that this group "+ key + " exist ? update your .emailrc\n")
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
    var from = options.config.label;
    if(from) options.from = from
      return options
  }

  function subject(options) {
    options.subject = cli.subject || "Sorry, I forgot the subject, again !!"  
    return options
  }

  function buildOptions(config){
    var options = { config: config } 
    to(options)
    body(options)
    subject(options)
    attach(options)
    from(options)
    if(cli.verbose) console.log( JSON.stringify(options, null, 3)  )
      return options
  }

  function main() {
    var config = JSON.parse(fs.readFileSync(cli.config, 'utf8'))

    if(cli.listgroups || cli.l) {
      var groups = config.groups
      for(var keys in groups) console.log(keys)
        return    
    }

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
        deliver({ user: ( cli.user || config.account ), pass: password }, config) 
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

  function toggleSparkle(interval){
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

    var  blink = fullStar
    , dots = ""

    return setInterval(function() {
      blink = blink(dots)
      dots += "."
    }, 800);
  }

  function deliver(auth, config) {
    var smtpTransport = nodemailer.createTransport("SMTP",{ service: "Gmail", auth: auth });
    if( cli.n )  var started = toggleSparkle()
      smtpTransport.sendMail(buildOptions(config), function(error, response){
        toggleSparkle(started)
        if(error) { 
          growlNotifier(error, " ✘ ")
          write(error, " ✘ ")
        }else{ 
          growlNotifier(error, " ✔ ")
          write(error, " ✔ ")
        }
        smtpTransport.close(); 
      });
  }
  
  function write(err, msg) {
    process.stdout.write(msg)
    if(err) process.stdout.write("\n-== Error ==-\n" + JSON.stringify(err, null , 4))
  }

  function growlNotifier(err, message) {
    var msg = [( ( err ) ? "Fail" : "Success" ), message ].join(" ")
    growl( msg , { title: 'Emailing' , image: "email" })
  }

  main();
