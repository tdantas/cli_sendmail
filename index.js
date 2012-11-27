var Mail = require('./lib/emailing')
  , optimist = require('optimist')
  , growl = require('growl')
  , fs = require('fs')

var argv = optimist.default('config', process.env['HOME'] + '/.emailrc')   
    .usage("Usage: $0 -s [subject] -b [body] -t [to] -u [ gmail account ]'")
    .alias('s', 'subject')
    .alias('b', 'text')
    .alias('t', 'to')
    .alias('c', 'cc')
    .alias('d', 'bcc')
    .alias('a', 'attachments')
    .alias('u', 'user')
    .demand('u')
    .alias('g', 'group')
    .argv

try {
  var config = JSON.parse(fs.readFileSync(argv.config, 'utf8'))
  if(argv.group) {
    config.groups = config.groups || {} 
    argv.group = config.groups[argv.group]
  }
  
  argv.from = config.sender

}catch(_){}

/* 
  Read the user password
*/

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
        sendMail(argv.user, password ) 
      break
      case "\u0003":
        process.exit()
      break
      default:
        password += char
      break
  }
});

/* Send Mail*/
function sendMail(account, password){
  var message = new Mail(argv)
  var interval = toggleSparkle()
  message.deliver(account, password, function(err) {
    toggleSparkle(interval)
    if(err) { growl(err.message, { title: "Mailing Fail ✘" })   }
    else    { growl("Message sent my Lord !", { title: "Mailing Success ✔" })}
    process.stdout.write("\n")  
    process.exit()
  }); 
}

function toggleSparkle(interval){
  if(interval) return clearInterval(interval);
  var  blink = star
  , dots = ""
  
  process.stdout.write("\r\n")
  
  return setInterval(function() {
    blink = blink(dots)
    dots += "."
  }, 1000);

// Hoisted Functions 
 function star(char){
    var full = " ★ "
    process.stdout.write("\r"+ char + full)
    return emptyStar
  }

  function emptyStar(char){
    var empty =" ☆ "
    process.stdout.write("\r" + char + empty)
    return star
  } 

}