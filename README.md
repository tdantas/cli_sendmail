Emailing , your cli send mail friend !
============
Send email using your lovely terminal (until now Gmail only ) 

Quick Install
--------------------

 ````
npm install -g emaling

Quick usage:
emailing -t "destination.email@domain.com" -u "thiago.chapa@gmail.com" --subject "Ping" --body "Pong" <Enter>
Password:

````

Lists
--------------------
With .emailrc you can predefine lists of emails

~/.emailrc

````
{ "groups" : 
  {
    "friends" : ["mark@domain.com" , "tom@domain.com", "jane@domain.com" ],
    "family"  : ["dad@email.com", "mom@email.com"]
  }
}

emailing -g "friends" --user "thiagochapa@gmail.com" --subject "Soccer ?" --body "What about play soccer today ?" <Enter>
Password:

````

Attachment
--------------------------
Instead of:
 * Open your browser
 * Compose Message ( Please don't forget the subject. )
 * Attach your file
 * Send

You can do this boring workflow in one line without boring *popups* validation

````
emailing -a ./pictures.zip --to "myfriend@domain.com" --user "thiagochapa@gmail.com"
````