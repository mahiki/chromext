
//Become true the first time the extension button is clicked
var alreadyEdited = false;

//True while the contentEditable is set to true
var isSkullEnabled = false;

//False while the skull animation is running
var	isClickable = true;

//Activate or desactive the skull
function activateSkull() {
	isClickable = false;
	if (!isSkullEnabled) {
		$("#darknessFalls").fadeIn(300, function () {
			$(".text-effect").textEffect({fps: 10})
			$("#skullOn").fadeIn(2000, function () {
				$("#darknessFalls").fadeOut(500, function () {
					$("body").attr('contenteditable', 'true');
					isClickable = true;
				});
			});
		});
		isSkullEnabled = true;
	} else {
		$("body").attr('contenteditable', 'false');
		$("#darknessFalls").fadeIn(300, function () {
			$(".text-effect").textEffect({reverse: true, fps: 10})
			$("#skullOn").fadeOut(1000, function () {
				$("#darknessFalls").fadeOut(500, function () {
					isClickable = true;
				});
			});
		});
		isSkullEnabled = false;
	}
}

function makeContentEditable() {
	if (!alreadyEdited) {
		//Insert divs
		$("body").prepend('<div id="darknessFalls"><img id="skullOn"></img><img id="skullOff"></img><div id="msg" class="text-effect">PAGE UNLOCKED</div></div>');
		//Url of images
		var skullOnUrl = chrome.extension.getURL("assets/img/skullOn.png");
		var skullOffUrl = chrome.extension.getURL("assets/img/skullOff.png");
		//Use the web_accessible_resources
		$("#skullOn").attr('src', skullOnUrl);
		$("#skullOff").attr('src', skullOffUrl);
		//Prevent another injection of code in the DOM
		alreadyEdited = true;
	}

	//Positioning of the skull
	var width = $(window).width();
	var left = width / 2 - 100;
	$("#skullOn").css('left', left+'px');
	$("#skullOff").css('left', left+'px');
	$("#msg").css('left', left+'px');

	//Activate the animate only if it's not already running
	if (isClickable) {
		activateSkull();
	}
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "makeContentEditable"){
    	makeContentEditable();
    }
  }
);