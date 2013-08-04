try {

var Cc = Components.classes;
var Ci = Components.interfaces;

var prefs =
  Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);



/*window.alert(Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch).getCharPref("extensions.cryptim.username"))*/




var BOSH_SERVICE = 'http://bosh.metajack.im:5280/xmpp-httpbind';
var connection = null;


function onConnect(status)
{
    var statuses=["ERROR","connecting","CONNFAIL","AUTHENTICATING","AUTHFAIL","CONNECTED","DISSCONNECTED","ATTACHED"]
    dump("\n--cryptim-->strophe_status "+statuses[status]+'\n');
    if (status == Strophe.Status.CONNECTED) {
	log('ECHOBOT: Send a message to ' + connection.jid + ' to talk to me.');

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

	log('ECHOBOT: I got a message from ' + from + ': ' + 
	    Strophe.getText(body));
    
	var reply = $msg({to: from, from: to, type: 'chat'})
            .cnode(Strophe.copyElement(body));
	connection.send(reply.tree());

	log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}



function StropheConnect(){
	connection = new Strophe.Connection(BOSH_SERVICE);
	connection.connect(prefs.getCharPref("extensions.cryptim.username"),
		prefs.getCharPref("extensions.cryptim.pass"),
		onConnect);
}




StropheConnect();















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
        //alert(aURI.spec);

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


} catch (err){dump("\n--cryptim-->err "+err+'\n');}

