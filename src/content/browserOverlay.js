try {
function log(key, value) {
	if (!value) {
		value = key
		key=""
	}
	dump("\n--cryptim-->"+key+" "+value+'\n')
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]                                  .getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage("\n--cryptim-->"+key+" "+value+'\n'); 
}


log("cryptim-loaded")

var Cc = Components.classes;
var Ci = Components.interfaces;

var prefs =
  Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);






var BOSH_SERVICE = 'http://bosh.metajack.im:5280/xmpp-httpbind';
var connection = null;


function onConnect(status)
{
    var statuses=["ERROR","connecting","CONNFAIL","AUTHENTICATING","AUTHFAIL","CONNECTED","DISSCONNECTED","ATTACHED"]
    log("strophe_status",statuses[status]);
    if (status == Strophe.Status.CONNECTED) {
	log("echobot", 'Send a message to ' + connection.jid + ' to talk to me.');

	connection.addHandler(onMessage, null, 'message', null, null,  null); 
	connection.send($pres().tree());
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
	var body = elems[0];

	log('echobot', 'I got a message from ' + from + ': ' + 
	    Strophe.getText(body));
    
	var reply = $msg({to: from, from: to, type: 'chat'})
            .cnode(Strophe.copyElement(body));
	connection.send(reply.tree());

	log('echobot', 'I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}



function StropheConnect(connect){
	connection = new Strophe.Connection(BOSH_SERVICE);
	if (connect) {
		connection.connect(prefs.getCharPref("extensions.cryptim.username"),
			prefs.getCharPref("extensions.cryptim.pass"),
			onConnect);	
	} else {
		connection.disconnect()
	}
}




//StropheConnect(false);















var myExtension = {
    oldURL: null,

    init: function() {
        gBrowser.addTabsProgressListener(this);
    },

    uninit: function() {
        gBrowser.removeTabsProgressListener(this);
    },

    processNewURL: function(aURI) {
        if (aURI.spec == this.oldURL) return;

        // now we know the url is new...
		//log("HTML", content.document.getElementById("html").innerHTML);
        log("opened-url",aURI.spec);
		if (/facebook\.com\//.test(aURI.spec)) {
			log("facebook");
			StropheConnect(true);
			
			
		}

		//check if facebook

        this.oldURL = aURI.spec;
    },

    // nsIWebProgressListener
    QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener",
                                           "nsISupportsWeakReference"]),

    onLocationChange: function(aBrowser, aProgress, aRequest, aURI) {
        this.processNewURL(aURI);
    },

    onStateChange: function() {},
    onProgressChange: function() {},
    onStatusChange: function() {},
    onSecurityChange: function() {}
};

window.addEventListener("load", function() { myExtension.init() }, false);
window.addEventListener("unload", function() { myExtension.uninit() }, false);


} catch (err){log("error",err)}

