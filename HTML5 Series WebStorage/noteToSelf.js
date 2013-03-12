window.onload = init;

function init() {
	// add click events to our buttons
	var button = document.getElementById("add_button");
	button.onclick = createSticky;

	var clearButton = document.getElementById("clear_button");
	clearButton.onclick = clearStickyNotes;

	// get our array from localStorage
	var stickiesArray = getStickiesArray();
	
	// loop over the array
	for (var i = 0; i < stickiesArray.length; i++) {
		var key = stickiesArray[i];
		var value = JSON.parse(localStorage[key]);
		// and add the stickies to the display
		addStickyToDOM(key, value);
	}

	window.addEventListener("storage", function(e){
		console.log(e);
	})
}

// method to get the stickies from localStorage if exists, else creates it
function getStickiesArray() {
	var stickiesArray = localStorage.getItem("stickiesArray");
	if (!stickiesArray) {
		stickiesArray = [];
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
	} else {
		stickiesArray = JSON.parse(stickiesArray);
	}
	return stickiesArray;
}

// creates sticky in localStorage and calls out to add it to the display
function createSticky() {
	var stickiesArray = getStickiesArray();
	var value = document.getElementById("note_text").value;
	var colorSelectObj = document.getElementById("note_color");
	var index = colorSelectObj.selectedIndex;
	var color = colorSelectObj[index].value;

	// create sticky note using JSON to hold value and color
	var currentDate = new Date();
	var key = "sticky_" + currentDate.getTime();
	var stickyObj = {
			"value": value,
			"color": color
	};
	localStorage.setItem(key, JSON.stringify(stickyObj));

	// add new sticky note key to array and update notes array in localStorage
	stickiesArray.push(key);
	localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
	
	addStickyToDOM(key, stickyObj);
}

// deletes a single sticky from localStorage and calls out to function to delete from display
function deleteSticky(e) {
	var key = e.target.id;
	if (e.target.tagName.toLowerCase() == "span") {
		key = e.target.parentNode.id;
	}
	var stickiesArray = getStickiesArray();
	if (stickiesArray) {
		for (var i = 0; i < stickiesArray.length; i++) {
			if (key == stickiesArray[i]) {
				stickiesArray.splice(i,1);
			}
		}
		localStorage.removeItem(key);
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
		removeStickyFromDOM(key);
	}
}

// adds stickies to the display
function addStickyToDOM(key, stickyObj) {
	var stickies = document.getElementById("stickies");

	var sticky = document.createElement("li");
	// set the id attribute to the key so we can find it using
	// the ids stored in the stickies array
	sticky.setAttribute("id", key);
	// use the stickyObj color, and set the background-color CSS style
	sticky.style.backgroundColor = stickyObj.color;

	var span = document.createElement("span");
	span.setAttribute("class", "sticky");

	// use the stickyObj value as the text for the sticky note 
	span.innerHTML = stickyObj.value;

	// add everything to the DOM
	sticky.appendChild(span);
	stickies.appendChild(sticky);

	// add an event listener so when you click on a sticky note it can be deleted
	sticky.onclick = deleteSticky;
}

// deletes a single sticky from the view
function removeStickyFromDOM(key) {
	var sticky = document.getElementById(key);
	sticky.parentNode.removeChild(sticky);
}

// clears out everything from localStorage
function clearStickyNotes() {
	localStorage.clear();
	var stickyList = document.getElementById("stickies");
	var stickies = stickyList.childNodes;
	// gets dom elements that are sticky to remove from the display
	for (var i = stickies.length-1; i >= 0; i--) {
		stickyList.removeChild(stickies[i]);
	}

	// reset stickies array
	var stickiesArray = getStickiesArray();
}