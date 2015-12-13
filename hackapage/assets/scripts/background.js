
chrome.browserAction.onClicked.addListener(function(tab) {
	// Communication with the page
	chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT},
	  function(tab) {
	    chrome.tabs.sendMessage(tab[0].id, {method: "makeContentEditable"});
	  });
});