
var map = null;
var credentials = "AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
$(document).ready(function() {
   map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),{credentials:"AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS"});
    
   $('#find').click(function(){
 
       DeletePushPins();
		var origin = $('#origin').val();
		var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + origin + "?output=json&jsonp=OriginGeocodeCallback&key=AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
       CallRestService(geocodeRequest);
       var destination = $('#destination').val();
       geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + destination + "?output=json&jsonp=DestGeocodeCallback&key=AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
        CallRestService(geocodeRequest);
	 });
    
});

function DeletePushPins()
{
    for(var i=map.entities.getLength()-1;i>=0;i--) {
        var pushpin= map.entities.get(i); 
        if (pushpin instanceof Microsoft.Maps.Pushpin) { 
            map.entities.removeAt(i);  
        }
    }
}

function OriginGeocodeCallback(result) 
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
        FindClosestPortsToOrigin(location.latitude, location.longitude, result.resourceSets[0].resources[0].address.countryRegion);
     }
  }
  
function DestGeocodeCallback(result) 
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
        FindClosestPortsToDestination(location.latitude, location.longitude, result.resourceSets[0].resources[0].address.countryRegion);
     }
  }

function CallRestService(request) 
  {
     var script = document.createElement("script");
     script.setAttribute("type", "text/javascript");
     script.setAttribute("src", request);
     document.body.appendChild(script);
  }

/**
Following code block will Find the Closest Ports to Origin
Calls another function on success
**/
function FindClosestPortsToOrigin(lat, lon, country){
	$.ajax({
		url: 'map/get_closest_ports',
		dataType: 'json',
		type: 'POST',
		data: ({lat: lat,
		        lon: lon,
		        country: country}),
		success: function(data){
			if(data.response == 'true'){
                CallOnOriginSuccess(data);
			}
		}
	});
}

function FindClosestPortsToDestination(lat, lon, country){
	$.ajax({
		url: 'map/get_closest_ports',
		dataType: 'json',
		type: 'POST',
		data: ({lat: lat,
		        lon: lon,
		        country: country}),
		success: function(data){
			if(data.response == 'true'){
                CallOnDestinatonSuccess(data);
			}
		}
	});
}

var originPortsFound;
var destinationPortsFound;
var originPortsLookupDone;
var destinationPortsLookupDone;
var originPorts;
var destinationPorts;

/**
If there are ports found, these functions will find the routing directions from origin point to port
**/
function CallOnOriginSuccess(data)
{
    originPortsLookupDone = 0;
    var ports = new Array();
    for (var i = 0; i < data.message.length; i++)
    {
        var port = new Object();
        port.name = data.message[i].name;
        port.id = data.message[i].port_id;
        port.country = data.message[i].country;
        ports.push(port);
    }
    //console.log("Ports: "+ports)
    originPortsFound = ports;
    originPorts = new Array();
    GetOriginDirections();
}

var currentOriginPortId = null;
var currentDestinationPortId = null;


function CallOnDestinatonSuccess(data)
{
    destinationPortsLookupDone = 0;
    var ports = new Array();
    for (var i = 0; i < data.message.length; i++)
    {
        var port = new Object();
        port.name = data.message[i].name;
        port.id = data.message[i].port_id;
        port.country = data.message[i].country;
        ports.push(port);
    }
    //console.log("Ports: "+ports)
    numberDestPorts = ports.length;
    
    
    destinationPortsFound = ports;
    destinationPorts = new Array();
    //GetDestinationDirections();
    
     
}



function GetOriginDirections()
{
    if(originPortsFound.length > 0){
        var start = $('#origin').val();
        var end = originPortsFound[0].name + ', '+originPortsFound[0].country;
        currentOriginPortId = originPortsFound[0].id;
        originPortsFound.splice(0,1);
        var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + end + "&routePathOutput=Points&output=json&jsonp=OriginRouteCallback&key=" + credentials;
        CallRestService(routeRequest);
    }else{
        originPortsLookupDone = 1;
        GetDestinationDirections();
    }

}

function GetDestinationDirections()
{
    if(destinationPortsFound.length > 0){
        var start = $('#destination').val();
        var end = destinationPortsFound[0].name + ', '+destinationPortsFound[0].country;
        currentDestinationPortId = destinationPortsFound[0].id;
        destinationPortsFound.splice(0,1);
        var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + end + "&routePathOutput=Points&output=json&jsonp=DestinationRouteCallback&key=" + credentials;
        CallRestService(routeRequest);
    }else{
        destinationPortsLookupDone = 1;
        FindPortRoutes();
    }

}


// call back function for Route
function OriginRouteCallback(result) {       
    if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) 
    {
        port = new Object();
        port.id = currentOriginPortId;
        port.boundingbox = result.resourceSets[0].resources[0].bbox;
        port.travelDistance = result.resourceSets[0].resources[0].travelDistance;
        port.travelDuration = result.resourceSets[0].resources[0].travelDuration;
        
        originPorts.push(port);
         /*
         // Draw the route
         var routeline = result.resourceSets[0].resources[0].routePath.line;
         var routepoints = new Array();
         for (var i = 0; i < routeline.coordinates.length; i++) {
             routepoints[i]=new Microsoft.Maps.Location(routeline.coordinates[i][0], routeline.coordinates[i][1]);
         }
         // Draw the route on the map
         var routeshape = new Microsoft.Maps.Polyline(routepoints, {strokeColor:new Microsoft.Maps.Color(200,0,0,200)});
         map.entities.push(routeshape);
         */

    }
    // callback to the calling function to get the rest of the ports
    GetOriginDirections();
 }
 
 // call back function for Route
 function DestinationRouteCallback(result) {       
     if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) 
     {
         port = new Object();
         port.id = currentDestinationPortId;
         port.boundingbox = result.resourceSets[0].resources[0].bbox;
         port.travelDistance = result.resourceSets[0].resources[0].travelDistance;
         port.travelDuration = result.resourceSets[0].resources[0].travelDuration;
         destinationPorts.push(port);
     }
     
     // call back to the original function to get the rest of the ports
      GetDestinationDirections();
  }
  
function FindPortRoutes(){
    if(destinationPortsLookupDone == 1 && originPortsLookupDone == 1){
        var originPortIds = new Array();
        var destinationPortIds = new Array();
        originPorts.sort(ComparePortDistance);
        destinationPorts.sort(ComparePortDistance);
        var voyages = new Array();
        for(var oport in originPorts){
            originPortIds.push(originPorts[oport].id);
        }
        for(var dport in destinationPorts){
            destinationPortIds.push(destinationPorts[dport].id);
        }
        //console.log(JSON.stringify(originPortIds));
        //console.log(JSON.stringify(destinationPortIds));
        
        $.ajax({
    		url: 'map/lookup_schedule',
    		dataType: 'json',
    		type: 'POST',
    		data: ({start_ports: JSON.stringify(originPortIds),
    		        end_ports: JSON.stringify(destinationPortIds)}),
    		success: function(data){
    			if(data.response == 'true'){
    			    //console.log(data.message);
                    ProcessVoyages(data.message);
    			}
    		}
    	});
    }
}

function ComparePortDistance(a, b){
    return a.travelDistance - b.travelDistance;
}

function ProcessVoyages(message)
{
    var arrSchedules = {};
    for(var i =0; i < message.length; i++)
    {
        voyages = message[i];
        if(!jQuery.isEmptyObject(voyages)){
            for (var x= 0; x < voyages.length; x++)
            {
                voyage = voyages[x];
                if(!jQuery.isEmptyObject(voyage)){
                    var schedule = new Object();
                    schedule.start_port = voyage.start_port_id;
                    schedule.end_port = voyage.end_port_id;
                    schedule.voyage_id = voyage.voyage_id;
                    schedule.ship_name = voyage.ship_name;
                    schedule.route_id = voyage.route_id;
                    scheduleLength = voyage.schedule.length;
                    schedule.end_port_name = voyage.schedule[scheduleLength-1].port.substring(0,1) + (voyage.schedule[scheduleLength-1].port.substring(1, voyage.schedule[scheduleLength-1].port.length)).toLowerCase();
                    schedule.start_port_name = voyage.schedule[0].port.substring(0,1) + (voyage.schedule[0].port.substring(1, voyage.schedule[0].port.length)).toLowerCase();
                    schedule.schedule = voyage.schedule;
                    // add the newly found port combination to the map
                    if(jQuery.isEmptyObject(arrSchedules[schedule.start_port+":"+schedule.end_port])){
                        arrSchedules[schedule.start_port+":"+schedule.end_port] = new Array();
                    }
                    arrSchedules[schedule.start_port+":"+schedule.end_port].push(schedule);
                }
            }
        }
    }
    
    PrintSchedules(arrSchedules);    
}

function ConvertPortArrayToMap(arr)
{
    var ports = {};
    for(var i = 0; i < arr.length; i++)
    {
        ports[arr[i].id] = arr[i];
    }
    return ports;
}

function PrintSchedules(portSchedules)
{
    $('#schedule_list').remove();
    var master_table = "<div id='schedule_list'>";
    var originPortsMap = ConvertPortArrayToMap(originPorts);
    var destinationPortsMap = ConvertPortArrayToMap(destinationPorts);
    for ( var portCombination in portSchedules ){
        var portCombinationRow = "<div id='schedule'>";
        var schedulesForPortCombination = portSchedules[portCombination];
        for (var index= 0; index < schedulesForPortCombination.length; index++){
            
            if (index == 0){
                var start = $('#origin').val();
                var end = $('#destination').val();
                var originPortDistance =  originPortsMap[schedulesForPortCombination[index].start_port].travelDistance;
                var endPortDistance =  destinationPortsMap[schedulesForPortCombination[index].end_port].travelDistance;
                portCombinationRow += "<table><tr><td>"+
                "<span class='heading'>distance from:</span>"+start+"<span class='heading'>to origin port:</span>"+schedulesForPortCombination[index].start_port_name+"<span class='heading'>is</span>"+originPortDistance+"<span class='heading'>kilometers</span>"
                +"</td></tr><tr><td>"
                +"<span class='heading'>distance from destination port:</span>"+schedulesForPortCombination[index].end_port_name+"<span class='heading'>to destination:</span>"+end+"<span class='heading'>is</span>"+endPortDistance+"<span class='heading'>kilometers</span>"
                +"</td></tr></table>";
            }
            
            var schedules = "<table class='schedule_info'><tr><th>port:</th><th>eta:</th><th>etd:</th></tr>";
            var shipSchedule = schedulesForPortCombination[index].schedule;
            
            for (var i = 0; i < shipSchedule.length; i++){
                schedules += "<tr><td class='port'>"+shipSchedule[i].port+"</td><td class='eta'>"+shipSchedule[i].eta+"</td><td class='etd'>"+shipSchedule[i].etd+"</td></tr>";
            }
            schedules += "</table>";
            
            var route =  "<table class='route'><tr>"+
            "<td class='heading'>ship name:</td><td class='ship_name'>"+schedulesForPortCombination[index].ship_name+"</td></tr>"+
            "<tr><td class='heading'>voyage:</td><td class='voyage_id'>"+schedulesForPortCombination[index].voyage_id+"</td>"+
            "</tr></table>"
            
            portCombinationRow += "<table><tr><td>"+route+"</td><td>"+schedules+"</td></tr></table>"
        }
        master_table += portCombinationRow+"</div>";
        
    }
    master_table += "</div>";
    $("#mapDiv").after(master_table);
}
