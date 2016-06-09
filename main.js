var scripts = [ 
	'lib/jquery.min.js',
	'lib/gamepad.min.js',
	'plex_injection.js'
];

function main()
{
	// Are we on a plex page?
	if (document.title != "Plex" || !document.getElementById("plex") )
		return;

	
	for (i = 0; i < scripts.length; i++) {
		var s = document.createElement('script');

		s.src = chrome.extension.getURL(scripts[i]);
		s.onload = function() {
			this.parentNode.removeChild(this);
		};
		(document.head||document.documentElement).appendChild(s);		
	}

	var port = chrome.runtime.connect({name: "toggleFullscreen"}); // Communication to background script for fullscreen

	window.addEventListener("message", function(event) { // Communication to the injected script to grab gamepad event
		// We only accept messages from ourselves
		if (event.source != window)
			return;
		
		if (event.data.type && (event.data.type == "FROM_PAGE")) {
			port.postMessage({}) // Ask fullscreen.js (background script) to go fullscreen
		}
		
	}, false);
}

main();

