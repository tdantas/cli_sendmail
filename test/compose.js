var Mail = require('../lib/emailing')
var should  = require('should')

describe('Mail Compose', function(){

 it("should create a envelope", function(){
    var expected = {
      to: "thiago.dantas@gmail.com",
      cc: "thiagochapa@gmail.com",
      bcc: "thiago.dantas@rupeal.com",
      subject: "subject",
      text: "Hello",
    }

    var mail = new Mail()
    mail.to = "thiago.dantas@gmail.com"
    mail.cc = "thiagochapa@gmail.com"
    mail.bcc = "thiago.dantas@rupeal.com"
    mail.text = "Hello"
    mail.subject = "subject"

    expected.should.eql(mail.envelope)

    var expected2 = {
      to: "thiago.dantas@gmail.com, thiago.dantas@rupeal.com",
      cc: "thiagochapa@gmail.com",
      bcc: "thiago.dantas@rupeal.com",
      subject: "subject",
      text: "Hello",
    }
    mail.to = ["thiago.dantas@gmail.com", "thiago.dantas@rupeal.com"]
    expected2.should.eql(mail.envelope)
  })

 it("should create a invalid envelope with empty group and no destination", function() {
    var mail = new Mail()
    mail.text = "Hello"
    mail.subject = "subject"
    mail.group = []
    mail.valid().should.be.false
  })

  it("should create a invalid envelope with an undefined group and no destination", function() {
    var mail = new Mail()
    mail.text = "Hello"
    mail.subject = "subject"
    mail.group = undefined
    mail.valid().should.be.false
  })

 it("should create a invalid envelope", function() {
    var mail = new Mail()
    mail.text = "Hello"
    mail.subject = "subject"
    mail.valid().should.be.false
  })

  it("should create a valid envelope with only cc destination", function() {
    var mail = new Mail()
    mail.cc = "thiago.chapa@gmail.com"
    mail.valid().should.be.true
  })

  it("should create a valid envelope with only bcc destination", function() {
    var mail = new Mail()
    mail.bcc = "thiago.chapa@gmail.com"
    mail.valid().should.be.true
  })

  it("should create a valid envelope with only to destination", function() {
    var mail = new Mail()
    mail.to = "thiago.chapa@gmail.com"
    mail.valid().should.be.true
  })

 it("should raise exception when try to deliver invalid email", function(done) {
    var mail = new Mail()
    mail.text = "text"
    mail.subject = "subject"
    mail.deliver("thiago.dantas@gmail.com", "password" , function(err) {
      should.exist(err)
      done()
    });
  })

  it("should enable one attachment ", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.attachments = "/path/to/file"

    var expected = {
        subject: "subject",
        text:    "text",
        attachments: [{
          fileName: "file",
          filePath: "/path/to/file"
        }]
    }
    expected.should.eql(mail.envelope)
  })


  it("should enable many attachments ", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.attachments = ["/path/to/file", "/path/to/file2"]

    var expected = {
        subject: "subject",
        text:    "text",
        
        attachments: [
          {
            fileName: "file",
            filePath: "/path/to/file"
          },
          {
            fileName: "file2",
            filePath: "/path/to/file2"
          }
        ]
    }

    expected.should.eql(mail.envelope)
  })

   it("should enable sent message to group", function() {
    var mail = new Mail({group: ["thiago@gmail.com", "dantas@gmail.com"]})
    mail.subject = "subject"
    mail.text = "text" 
    var expected = { subject: "subject", text: "text", to: ["thiago@gmail.com", "dantas@gmail.com"].join(", ")}
    expected.should.eql(mail.envelope)
  
  })
  
  it("should be able send message to group", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text" 
    mail.group = ["thiago@gmail.com", "dantas@gmail.com"]
    var expected = { subject: "subject", text: "text", to: ["thiago@gmail.com", "dantas@gmail.com"].join(", ")}
    expected.should.eql(mail.envelope)
  
  })

  it("should append group destinations with to destination generating 3 emails", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.to = "ping@gmail.com" 
    mail.group = ["thiago@gmail.com", "dantas@gmail.com"]
    var expected = { subject: "subject", text: "text", to: ["thiago@gmail.com", "dantas@gmail.com", "ping@gmail.com"].join(", ")}
    expected.should.eql(mail.envelope)
  
  })


  it("should append the group emails with to generating 4 emails", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.to = ["ping@gmail.com", "pong@gmail.com"] 
    mail.group = ["thiago@gmail.com", "dantas@gmail.com"]
    var expected = { subject: "subject", text: "text", to: ["thiago@gmail.com", "dantas@gmail.com", "ping@gmail.com", "pong@gmail.com"].join(", ")}
    expected.should.eql(mail.envelope)
  })

  it("should append the group emails with to", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.to = "ping@gmail.com"
    mail.group = "pong@gmail.com"
    var expected = { subject: "subject", text: "text", to: ["pong@gmail.com", "ping@gmail.com"].join(", ")}
    expected.should.eql(mail.envelope)
  })

  it("should create a envelope with subject 'subject', text 'text' and to 'pong@gmail.com' ", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.group = "pong@gmail.com"
    var expected = { subject: "subject", text: "text", to: "pong@gmail.com"}
    expected.should.eql(mail.envelope)
  })

  it("should be valid with one group destination", function() {
    var mail = new Mail()
    mail.subject = "subject"
    mail.text = "text"
    mail.group = "pong@gmail.com"
    mail.valid().should.be.true
  })

  it("should create a envelope with subject 'subjecting'", function() {
    var mail = new Mail()
    mail.subject = "subjecting"
    mail.text = "text"      
    var expected =   {
        subject: "subjecting",
        text:    "text"
    }
    expected.should.eql(mail.envelope)  
  })
  

  it("should create a envelope with body 'texting'", function() {
    var mail = new Mail()
    mail.subject = "subjecting"
    mail.text = "texting"      
    var expected =   {
        subject: "subjecting",
        text:    "texting"
    }
    expected.should.eql(mail.envelope)  
  })


})