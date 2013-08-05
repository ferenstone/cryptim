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













function examplePageLoad(event) {
  if (event.originalTarget instanceof HTMLDocument) {
	log("loaded-HTML",event.originalTarget.URL.toString())
    var win = event.originalTarget.defaultView;
if (/facebook\.com\//.test(event.originalTarget.URL.toString())) {
			log("facebook");
			StropheConnect(true);
			
			
		}
  }
}

// do not try to add a callback until the browser window has
// been initialised. We add a callback to the tabbed browser
// when the browser's window gets loaded.
window.addEventListener("load", function () {
  // Add a callback to be run every time a document loads.
  // note that this includes frames/iframes within the document
  gBrowser.addEventListener("load", examplePageLoad, true);
}, false);

window.addEventListener("unload", function () {
  gBrowser.removeEventListener("load", examplePageLoad, true);
}, false);

} catch (err){log("error",err)}

