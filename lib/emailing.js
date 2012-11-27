var nodemailer = require('nodemailer')
var path = require('path')

module.exports = Mail

function Mail(params) {
  params = params || {}
  if (!(this instanceof Mail)) return new Mail(params);
  this.compose(params)
}

Mail.prototype = {

  get to() { return this._to },
  set to(destination) { this._to = ( Array.isArray(destination) ? destination.join(", ") : destination )  },
 
  get cc() { return this._cc },
  set cc(copy) {  this._cc = ( Array.isArray(copy) ? copy.join(", ") : copy ) },
 
  get bcc() { return this._bcc },
  set bcc(copy) {  this._bcc = ( Array.isArray(copy) ? copy.join(", ") : copy ) },

  get text() { return this._body || "\nSent by your faithful employee !" },
  set text(msg) { this._body = msg },

  get from() { return this._from },
  set from(sender) { if( 'string' === typeof sender ) this._from = sender },

  get subject() { return this._subject || "I forgot the subject, again !" },
  set subject(subj) { this._subject = subj },

  get envelope() { return clean( _envelope.call(this)) },

  set attachments(attach) { 
    if(attach !== undefined && attach !== null)
      this._attach = _attachments(attach)
  },

  get attachments() {  return this._attach },

  set group(destinations) { 
    var to = [ _group(destinations) , this.to ].filter(function(item){ return ( item !== undefined && item !== null && item !== "" ) }).join(', ')
    if(to != "") this._to = to 
  },
  get group() { return this._to }

 }

Mail.prototype.compose = function(params) {
 
  this.to = params.to
  this.cc = params.cc
  this.bcc = params.bcc
  this.text = params.text
  this.from = params.from
  this.attachments = params.attachments
  this.group = params.group

 }

Mail.prototype.valid = function() {
  return  ( this.to !== undefined && this.to !== null )
       || ( this.cc !== undefined && this.cc !== null )
       || ( this.bcc !== undefined && this.bcc !== null )
}

Mail.prototype.deliver = function(account, password, callback) {
  var smtpTransport = nodemailer.createTransport("SMTP",{ service: "Gmail", auth: { user: account, pass: password } });
  
  if( !this.valid() ) {
    return process.nextTick( function() {
      callback( new Error('Message must at least have one destination') )
     } ); 
  }

  smtpTransport.sendMail(this.envelope, function(error, response){
    if(error) return callback(error)
    else callback()
  })
}

// Private Functions
function _group(dest) {
  var destinations = ( Array.isArray(dest) ? dest : [ dest ])
  return destinations.join(", ")
}

function _envelope() {
  return {
    from: this.from, 
    to: this.to ,
    cc: this.cc,
    bcc: this.bcc,
    subject: this.subject,
    text: this.text,
    attachments: this.attachments
  }
}

function _attachments(attach) {
  var result;
  var files = ( Array.isArray(attach) ? attach : [ attach ])
  if(files.length > 0 ) {
    result = []
    files.forEach(function(file) {
      result.push({ fileName: path.basename(file), filePath: file })
    });
  }  
  return result  
}

function clean(mailEnvelope) {
  var options = ["from", "to", "cc", "bcc", "subject", "text", "attachments"]
  options.forEach(function(value){
    if(mailEnvelope[value] === undefined ) delete mailEnvelope[value]
  })

  return mailEnvelope
}

