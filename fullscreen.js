var previousState = "maximized";

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "toggleFullscreen");
  port.onMessage.addListener(function(msg) {
    chrome.windows.getCurrent({},function (w) { 
        if ( w.state != "fullscreen" ) {
            previousState = w.state;
            chrome.windows.update(-2, { state: "fullscreen" } );
        }
        else
            chrome.windows.update(-2, { state: previousState } );
    } );
    
  });
});