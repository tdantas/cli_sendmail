cli_sendmail
============
Send email using your lovely terminal (until now Gmail only ) 

Quick Install
--------------------

 ````
echo "{}" > ~/.emailrc

git clone git://github.com/tdantas/cli_sendmail.git && cd cli_sendmail
npm install
node email.js -t to -u user -b [body text] -s [subject]

Quick usage:
node email.js --to "destinationEmail@domain.com" --user "thiagochapa@gmail.com" --subject "Ping" --body "Pong" <Enter>
Password:
 

````

Lists
--------------------
With .emailrc you can predefine lists of emails

~/.emailrc

````
{ "groups" : 
  {
    "friends" : ["friend1@domain.com" , "friend2@domain.com" ],
    "family"  : ["dad@email.com", "mom@email.com"]
  }
}

node email.js -g "friends" --user "thiagochapa@gmail.com" --subject "Soccer ?" --body "What about play soccer today ?" <Enter>
Password:

````


