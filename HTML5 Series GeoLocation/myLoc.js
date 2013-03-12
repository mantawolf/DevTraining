// GLOBALS
var map = null;
var ourCoords = {
	latitude: 32.981470,
	longitude: -96.831440
};

// Set onload event
window.onload = getMyLocation;

// verify if geolocation is supported
function getMyLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	}else{
		alert("Oops, no geolocation support");
	}
}

// success handler
function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById("location");

	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

	var km = computeDistance(position.coords, ourCoords);
	var distance = document.getElementById("distance");
	distance.innerHTML = "You are " + km + " km from API Healthcare";

	showMap(position.coords);
}

// uses what most distance computations use, Haversine equation
function computeDistance(startCoords, destCoords){
	var startLatRads = degreesToRadians(startCoords.latitude);
	var startLongRads = degreesToRadians(startCoords.longitude);
	var destLatRads = degreesToRadians(destCoords.latitude);
	var destLongRads = degreesToRadians(destCoords.longitude);

	var Radius = 6371;
	var distance = Math.acos(
		Math.sin(startLatRads) * Math.sin(destLatRads) + 
		Math.cos(startLatRads) * Math.cos(destLatRads) * 
		Math.cos(startLongRads - destLongRads)
		) * Radius;

	return distance;
}

// need radians instead of degrees to calculate distance
function degreesToRadians(degrees){
	var radians = (degrees * Math.PI)/180;
	return radians;
}

// create and show a google map object
function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	var mapOptions = {
		zoom: 10, // 0 - 21, bigger is more zoomed, 10 is about city size
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP // satellite, hybrid, roadmap
	};

	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

	var title = "Here I am";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}

// code to add markers to map
function addMarker(map, latLong, title, content){
	var markerOptions = {
		position: latLong,
		map: map,
		title: title,
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);
	
	var infoWindowOptions = {
		content: content,
		position: latLong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, "click", function(){
		infoWindow.open(map);
	});
}

// error handler
function displayError(error){
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied by user",
		2: "Position is not available",
		3: "Request timed out"
	};

	var errorMessage = errorTypes[error.code];
	if(error.code == 0 || error.code == 2){
		errorMessage = errorMessage + " " + error.message;
	}

	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}