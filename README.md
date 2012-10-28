cli_sendmail
============

Quick Install
--------------------

 ````javascript
echo "{}" > ~/.emailrc
git clone git://github.com/tdantas/cli_sendmail.git && cd cli_sendmail
npm install
node email.js -t to -u user -b [body text] -s [subject]

For instance:
node email.js -t destination_email@domain.com -u thiagochapa@gmail.com 

````

Send email using your lovely terminal
