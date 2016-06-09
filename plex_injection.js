/* Makes use of https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library */

console.log('Injecting Gamepad support into Plex...');


eScreen = {
	EPISODE : 0,
	PLAYER : 1,
	RESUME : 2,
	MEDIA_INFO : 3,
}


var gamepad = new Gamepad();

gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    var CURRENT_SCREEN = null
	
    if ( $(".modal-header").length != 0 ) {
        if ( $(".modal-header>.modal-title").text().search("Resume") != -1 && $("a.offset").length != 0 )
			CURRENT_SCREEN = eScreen.RESUME; // Resume or start from beginning?
        else if ( $(".modal-header>.modal-title").text().search("Media Info") != -1 )
			CURRENT_SCREEN = eScreen.MEDIA_INFO;
    }
	else if ( $("button.previous-btn").attr("class") == "previous-btn btn-link hidden disabled" ) 
		CURRENT_SCREEN = eScreen.PLAYER;
	else
		CURRENT_SCREEN = eScreen.EPISODE;
	
	switch (CURRENT_SCREEN) {
		case eScreen.EPISODE:
			if ( e.control == "DPAD_LEFT" )
				$(".previous-btn").children(".chevron-left").click();
			else if ( e.control == "DPAD_RIGHT" )
				$(".next-btn").children(".chevron-right").click();
			else if ( e.control == "START_FORWARD" || e.control == "FACE_1" ) // A or Start
				$(".media-poster-overlay").click();
			else if ( e.control == "FACE_3" ) // X
				simulateKeypress(73);  // Media info
			break;
	
		case eScreen.PLAYER:
			// Bring up the video controls menu whenever we press something, by simulating a mouse move
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent("mousemove",true,false,window,0,Math.random()*100,0,Math.random()*100,0,false,false,false,false,0,null)
			$(".video-background")[0].dispatchEvent(event)
			
			if ( e.control == "DPAD_UP" )
				simulateKeydown(38); // Up arrow    
			else if ( e.control == "DPAD_DOWN" )
				simulateKeydown(40); // Down arrow 
			else if ( e.control == "START_FORWARD" || e.control == "FACE_1" ) // A or Start
				$(".video-overlay-btn").click();
			else if ( e.control == "FACE_3" ) // X
				$(".volume-btn").click()  // Mute
		    else if ( e.control == "LEFT_TOP_SHOULDER" ) 
				simulateKeypress(91); // ASCII key code
			else if ( e.control == "RIGHT_TOP_SHOULDER" ) 
				simulateKeypress(93); 
			else if ( e.control == "LEFT_BOTTOM_SHOULDER" ) 
				simulateKeypress(44);
			else if ( e.control == "RIGHT_BOTTOM_SHOULDER" ) 
				simulateKeypress(46);
			else if ( e.control == "FACE_2" || e.control == "SELECT_BACK"  )
				if ( $(".player-close-btn").length != 0 )
					$(".player-close-btn").click();
			break;
	
		case eScreen.RESUME:
			if ( e.control == "START_FORWARD" || e.control == "FACE_1" )        
                $("a.offset")[0].click()  // Resume
            else if ( e.control == "FACE_3" ) // X
                $("a.offset")[1].click()  // Start from beginning
            else if ( e.control == "FACE_2" || e.control == "SELECT_BACK" )
                $(".close").click();
			break;
		
		case eScreen.MEDIA_INFO:
            if ( e.control == "FACE_3" || e.control == "FACE_2" || e.control == "SELECT_BACK" )
                $(".close").click();
			
		default:
			break;
	}
			
	// Globals
			
    if ( e.control == "FACE_4" )  // Y
        window.postMessage({ type: "FROM_PAGE" }, "*"); // Ask main.js to deal with fullscreen
    else if ( e.control == "LEFT_STICK" ) // Left Stick press
        location.reload();
});

if (!gamepad.init()) {
    alert('Your browser does not support gamepads, get the latest Google Chrome.');
}


// HUD hack to change text live with button mappings
window.setInterval(
	function() {
		if ( gamepad.count () == 0 )
			return
			
		// Handle the "Resume" dialog
		if ( $(".modal-header").length != 0 && $(".modal-header").attr("controlinserted") != "true"  ) {
			if ( $(".modal-header>.modal-title").text().search("Resume") != -1 && $("a.offset").length != 0 ) {
				$("a.offset")[0].innerHTML = String.fromCharCode(9398) + " " + $("a.offset")[0].text;  // (A) Resume from xx:xx
				$("a.offset")[1].innerHTML = String.fromCharCode(9421) + " " + $("a.offset")[1].text;  // (B) Start from beginning
				$(".modal-header").attr("controlinserted","true")
			}
		}
	}
,500);


/* Modified from http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key */
simulateKeydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return k;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return k;
                }
    });     

    oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, k, k, "", "", false, "");
    oEvent.keyCodeVal = k;
    document.dispatchEvent(oEvent);
}

simulateKeypress = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return k;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return k;
                }
    });     

    oEvent.initKeyboardEvent("keypress", true, true, document.defaultView, k, k, "", "", false, "");
    oEvent.keyCodeVal = k;
    oEvent.charCode = k;
    document.dispatchEvent(oEvent);
}
