
var map = null;
var credentials = "AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
$(document).ready(function() {
   map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),{credentials: credentials});
    
   $('#find').click(function(){
       // hide map to preserve the overlay, map doesn't allow overlay to be shown
       $("#mapDiv").hide();
       $('#overlay').show('slow', function() {
          // Animation complete.
        });
       	DeletePushPins();
		var origin = $('#origin').val();
		var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + origin + "?output=json&jsonp=GeocodeCallback&key="+credentials;
       	CallRestService(geocodeRequest);
       	var destination = $('#destination').val();
       	geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + destination + "?output=json&jsonp=GeocodeCallback&key="+credentials;
        CallRestService(geocodeRequest);
    	$.ajax({
    		url: 'map/run_query',
    		dataType: 'json',
    		type: 'POST',
    		data: ({origin: origin,
    		        destination: destination}),
    		success: function(data){
    			if(data.response == true){
                    PrintSchedules(data.origin, data.destination, data.routes);
    			}else{
    			    $('#overlay').hide('slow', function() {
                          // Animation complete.
                          $("#mapDiv").show();
                          alert("Sorry No Results");
                        });
    			}
    		}
    	});
	 });
});


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

// subDivId is where we have to update the distance
function DrawRoute (result, subDivId) {
    if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) 
     {
         var travelDistance = result.resourceSets[0].resources[0].travelDistance;
         var travelDuration = result.resourceSets[0].resources[0].travelDuration;
         console.log("This is json o: "+subDivId);
         $("#"+subDivId).replaceWith('Distance is: '+travelDistance+" km Duration is: "+(travelDuration/3600).toFixed(2)+" hours");
         
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
         $("#"+subDivId).replaceWith('There is an error! Sorry, we will flog our programmer to ensure this does not happen again');
     }
}

/**
draw shipping route on microsoft map
**/
function DrawShipRoute (ports) {
    ClearMap();
    var points = new Array();
    var polygonWithPins = new Microsoft.Maps.EntityCollection();
    for (var i in ports){
        var location = new Microsoft.Maps.Location(ports[i].lat, ports[i].lon);
        points.push(location); 
        
        // set up push pin
        // Add a pin to the center of the map
        var pin = new Microsoft.Maps.Pushpin(location, {text: ports[i].port}); 
        pin.title = ports[i].port;
        pin.description = ports[i].port+"Description";
        // Create the infobox for the pushpin
       
        // Add handler for the pushpin click event.
        Microsoft.Maps.Events.addHandler(pin, 'mouseover', DisplayPortInfoBox);
        // Hide the infobox when the map is moved.
        Microsoft.Maps.Events.addHandler(pin, 'mouseout', function(){
            console.log("Mouse Out Event");
            map.entities.pop();
        });
        polygonWithPins.push(pin);
    }
    var line = new Microsoft.Maps.Polyline(points,{strokeColor:new Microsoft.Maps.Color(200, 100, 0, 100), strokeThickness:3});
    polygonWithPins.push(line);
    map.entities.push(polygonWithPins);
}

var pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(10,0), null);

function DisplayPortInfoBox(e){
    if(e.targetType == 'pushpin'){
        console.log("here");
        var infoboxOptions = {width :200, height :100, showCloseButton: true, zIndex: 0, offset:new Microsoft.Maps.Point(10,0), showPointer: true, title:e.target.title, description:e.target.description }; 
        pinInfobox.setLocation(e.target.location);
        console.log("here 2");
        pinInfobox.setOptions(infoboxOptions); 
        console.log("here 3");
        map.entities.push(pinInfobox);
        console.log("here 4");
    }
}

function CallRestService(request) 
{
     var script = document.createElement("script");
     script.setAttribute("type", "text/javascript");
     script.setAttribute("src", request);
     document.body.appendChild(script);
}
 
