
// map is defined here, but loaded in the header
// we can only load map in the document.ready
var map = null;
var credentials = "AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
var directionsManager;
var directionsErrorEventObj;
var directionsUpdatedEventObj;
var directionsUpdatedEventObj;
var distanceUnitSelected = 0;


// only load map when window is fully loaded
function LoadMap(){
	console.log("Calling Load Map");
  	MapResize();
	ResultsContainerResize();
	ResultsDetailResize();	
	$('#mapDiv').show();
	console.log("Map div should show now");
}

// dispose of the map
// and all map related functions
function DisposeAllMap(){
	detachEvents();
	disposeDirections();
	disposeMap();
}

// Detach all Map Events
function detachEvents(){
	// check if directions Manager exists
	if (directionsManager) { 
		if (directionsUpdatedEventObj)
		{
			Microsoft.Maps.Events.removeHandler(directionsUpdatedEventObj);
			directionsupdatedEventObj = null;
		}
		if (directionsErrorEventObj)
		{
			Microsoft.Maps.Events.removeHandler(directionsErrorEventObj);
			directionsErrorEventObj = null;
		}
	}
}

// Dispose Direction Managers
function disposeDirections(){
	if (directionsManager) { 
		directionsManager.dispose();
		console.log('Directions Manager object disposed');
		directionsManager = null;
	}
}

// Dispose of the Map
function disposeMap(){
	if (typeof (map) != 'undefined' && map != null) { 
		map.dispose(); 
	} 
	else 
    	console.log('map is not defined');
}

// resize functions have to be defined here, otherwise in the ajax load
// call back function they will throw an undefined error
// resizes the map on window movement
function MapResize(){
	var mapHeight = getWindowHeight() - (60 + parseInt($('#results-detail').height()));
	var mapWidth = getWindowWidth()-($("#results-container").width()+1);
	map.setOptions({height:mapHeight, width: mapWidth});
	map.setView({center: map.getCenter(), animate:false});
	$("#mapDiv").height(mapHeight).width(mapWidth);
}

function MapResizeMinimizedResults(){
	var mapHeight = getWindowHeight() - (60 + parseInt($('#results-detail').height()));
	var mapWidth = getWindowWidth();
	map.setOptions({height:mapHeight, width: mapWidth});
	$("#mapDiv").height(mapHeight).width(mapWidth);
}

// subDivId is where we have to update the distance
function DrawRoute (result, subDivId) {
    if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) 
     {
         var travelDistance = result.resourceSets[0].resources[0].travelDistance;
         var travelDuration = result.resourceSets[0].resources[0].travelDuration;
         console.log("This is json o: "+subDivId);
         $("#"+subDivId).html('Distance is: '+travelDistance+" km Duration is: "+(travelDuration/3600).toFixed(2)+" hours");
         
         // Set the map view
          var bbox = result.resourceSets[0].resources[0].bbox;
          var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
          map.setView({ bounds: viewBoundaries});
          // Draw the route
          var routeline = result.resourceSets[0].resources[0].routePath.line;
          var routepoints = new Array();
          for (var i = 0; i < routeline.coordinates.length; i++) {
              routepoints[i]=new Microsoft.Maps.Location(routeline.coordinates[i][0], routeline.coordinates[i][1]);
          }
          // Draw the route on the map
          var routeshape = new Microsoft.Maps.Polyline(routepoints, {strokeColor:new Microsoft.Maps.Color(200,0,0,200)});
          map.entities.push(routeshape);

			
     }else{
         // error with service
         $("#"+subDivId).html('There is an error! Sorry, we will flog our programmer to ensure this does not happen again');
     }

	// reset detail box to normal, remove waiting animation
	DetailBoxFinishedLoading();
	

	
}



/** helper functions **/

// delete all push pins
function DeletePushPins()
{
    for(var i=map.entities.getLength()-1;i>=0;i--) {
        var pushpin= map.entities.get(i); 
        if (pushpin instanceof Microsoft.Maps.Pushpin) { 
            map.entities.removeAt(i);  
        }
    }
}

// delete all routes
function DeleteRoutes() {
    for(var i=map.entities.getLength()-1;i>=0;i--) {
        var entity = map.entities.get(i); 
        if (entity instanceof Microsoft.Maps.Polyline) { 
            map.entities.removeAt(i);  
        }
    }
}

function ClearMap () {
    map.entities.clear();
}

function GeocodeCallback(result) 
{
     if (result &&
            result.resourceSets &&
            result.resourceSets.length > 0 &&
            result.resourceSets[0].resources &&
            result.resourceSets[0].resources.length > 0) 
     {
        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        var pushpin = new Microsoft.Maps.Pushpin(location); 
        map.entities.push(pushpin);
     }
}

function AddPushPin (lat, lon) {
    var location = new Microsoft.Maps.Location(lat, lon);
    var pushpin = new Microsoft.Maps.Pushpin(location); 
    map.entities.push(pushpin);
}


// driving directions
function createDirectionsManager() {
    var displayMessage;
    if (!directionsManager) 
    {
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        displayMessage = 'Directions Module loaded\n';
        displayMessage += 'Directions Manager loaded';
    }
    console.log(displayMessage);
    directionsManager.resetDirections();
    directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function(arg) { console.log(arg.message) });
    directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function() { console.log('Directions updated') });
}

function LoadDirectionsModule() {
    if (!directionsManager)
    {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createDirectionsManager });
    }
    else
    {
        createDirectionsManager();
    }
}

// takes in 2 way points and an the id where the directions should be printed 
// sets the directions into the map
function createDrivingRoute(startPoint, endPoint, elementId) {
	if (!directionsManager) { createDirectionsManager(); }
	directionsManager.resetDirections();
	// Set Route Mode to driving 
	directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
	// add way points
	directionsManager.addWaypoint(startPoint);
	directionsManager.addWaypoint(endPoint);
	// set the request options, distance unit
	directionsManager.setRequestOptions({distanceUnit: distanceUnitSelected});
	// Set the element in which the itinerary will be rendered
	directionsManager.setRenderOptions({ itineraryContainer: document.getElementById(elementId) });
	if (directionsUpdatedEventObj){
		Microsoft.Maps.Events.removeHandler(directionsUpdatedEventObj);
		directionsupdatedEventObj = null;
    }
    directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', DetailBoxFinishedLoading());
	if(directionsErrorEventObj){
		Microsoft.Maps.Events.removeHandler(directionsErrorEventObj);
		directionsErrorEventObj = null;
	}
	directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function(arg) { HandleDrivingDirectionsError(arg) });
	
	console.log('Calculating directions...');
	directionsManager.calculateDirections();
}


function HandleDrivingDirectionsError(arg){
	DetailBoxFinishedLoading();
	var errorHtml = GetMessageBox(arg.message, 0);
	$("#results-detail-text").html(errorHtml);
	
}

// this function has to be the last one in this file
function CallRestService(request) 
{
     var script = document.createElement("script");
     script.setAttribute("type", "text/javascript");
     script.setAttribute("src", request);
     document.body.appendChild(script);
}
