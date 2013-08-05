try {

Components.utils.import("chrome://cryptim/content/xmpp.jsm");

log("cryptim-loaded")

var Cc = Components.classes;
var Ci = Components.interfaces;

var prefs =
  Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);



















function onPageLoad(event) {
  if (event.originalTarget instanceof HTMLDocument) {
	log("loaded-HTML",event.originalTarget.URL.toString())
	if (/facebook\.com\//.test(event.originalTarget.URL.toString())) {
			log("facebook");
			facebooks += 1;
			if (!connection.connected) {
				connection.connect(prefs.getCharPref("extensions.cryptim.username"),
					prefs.getCharPref("extensions.cryptim.pass"),
					onConnect);
			}
			
			
		}
  }
}
function onPageUnload(event) {
  if (event.originalTarget instanceof HTMLDocument) {
	log("unloaded-HTML",event.originalTarget.URL.toString())
	if (/facebook\.com\//.test(event.originalTarget.URL.toString())) {
			log("no-facebook");
			facebooks -= 1;
			if (facebooks <= 0) {
				log("disconnecting")
				connection.disconnect()
			}
			
			
		}
  }
}

// do not try to add a callback until the browser window has
// been initialised. We add a callback to the tabbed browser
// when the browser's window gets loaded.
//window.addEventListener("load", function () {
  log("event-added")
  gBrowser.addEventListener("load", onPageLoad, true);
  gBrowser.addEventListener("beforeunload", onPageUnload, true);
//}, false);


} catch (err){dump("error"+err)}

