Emailing , your cli send mail friend !
============
Send email using your lovely terminal (until now Gmail only ) 

Quick Install
--------------------

 ````
npm install -g emaling

Quick usage:
emailing -t "destination.email@domain.com" --subject "Ping" --body "Pong" thiago.chapa@gmail.com <Enter>
Password:

````

Lists
--------------------
With .emailrc you can predefine lists of emails

~/.emailrc

````
{
 "sender" : "Thiago Dantas <thiago.dantas@rupeal.com>",
 "groups" : 
  {
   "family" : ["mom@rupeal.com" , "dad@rupeal.com" ],
   "friends" : [  "messi@domain.com",
                  "ronaldinho@domain.com", 
                  "rivaldo@domain.com" ,
                  "romario@domain.com",
                  "kaka@domain.com",
                  "neymar@domain.com"
                 ],
  }
}

emailing -g "friends" --subject "Soccer ?" --body "What about play soccer today ?" thiagochapa@gmail.com <Enter>
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
emailing -a ./pictures.zip --to "myfriend@domain.com"  --subject "Holliday Pictures"  thiagochapa@gmail.com
````

Growl Notifications
-----------------------------
To enable receive growl notification install [growlnotify](http://growl.info/extras.php#growlnotify).
