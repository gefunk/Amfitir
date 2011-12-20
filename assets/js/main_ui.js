
// attach event Handlers to all the schedule rows 
function attachHandlers()  {
    
    // attach handlers to any possible tool tips
    $('.time_row_sub').live('click', function(){
        // get information about this route, the id attribute contains, ship name, voyage id, and route code
        var id = $(this).attr('id');
        var ship_name = id.substring(0, id.indexOf(":"));
        ship_name = ship_name.replace(/(\r\n|\n|\r)/gm,"");
        ship_name = ship_name.replace(/nbsp;/g, ' ');
        var voyage_id = id.substring(id.indexOf(":")+1, id.lastIndexOf(":"));
        voyage_id = voyage_id.replace('nbsp;', ' ');
        var route_id = id.substring(id.lastIndexOf(":")+1, id.length);
        var carrier = $(this).children('.full-name').text();
        
        // get the start port id and end port id from the parent div
        var port_ids = $(this).parents('.schedule').children('.schedule_selected').attr('id');
        var start_port_id = port_ids.substring(0, port_ids.indexOf(":"));
        var end_port_id = port_ids.substring(port_ids.indexOf(":")+1, port_ids.lastIndexOf(":"));
        
        var position = $(this).offset();
        var width = parseInt($(this).width());
        // set the left most corner pixel location of the pop up info, so it is center to the div
        var left = parseInt(position.left) + (width)
        
        var htmlToPrint = PrintToolTipWaiting(left, position.top, route_id, voyage_id, ship_name, carrier);
        $('.content').before(htmlToPrint);
        
        $.ajax({
    		url: 'map/pop_up_info',
    		dataType: 'json',
    		type: 'POST',
    		data: ({route_id: route_id, voyage_id: voyage_id, ship_name: ship_name, start_port_id: start_port_id, end_port_id: end_port_id}),
    		success: function(data){
                var number_of_days_for_journey = days_between(parseDate(data.ports[data.ports.length-1].etd), parseDate(data.ports[0].eta));
                DrawShipRoute(data.ports);
                $('#info_num_days').text(number_of_days_for_journey);
                $('#ports_loading').replaceWith(PrintToolTipDone(data.ports));
        	    $('#container').click(function() {
        	       $('#popup_info').remove();
        	    });
    		}
    	});
	    
	});
    
    
	// hover for anything marked schedule group, marks blue or not blue
	$(".schedule").hover(
		// handle on hover over schedule
		function(){
			// if the class is selected don't do the hover action again
			if($(this).children('.schedule_selected').length ==  0){
				$(this).children(":first-child").addClass("schedule_first");
				$(this).children(".schedule_row").last().addClass("schedule_last");
				$(this).children(".schedule_row").addClass("schedule_group");
					// add the blue hover functionality to all schedule group classes
					$(".schedule_group").hover(
					function(){
						$(this).addClass("schedule_hover");
					},
					function(){
						$(this).removeClass("schedule_hover");
					});
			} // end if
		},
		function(){
			if($(this).children('.schedule_selected').length == 0){
				$(this).children(":not(:last-child)").removeClass("schedule_group");
				$(this).children(":first-child").removeClass("schedule_first");
				$(this).children(".schedule_row").last().removeClass("schedule_last");
			}
		}
	);
	

	
	// add click handlers for all schedule legs
	// add click handler for all children
	$(".schedule").children().click(function(){
		// remove any sub info blocks in this schedule row
		$(this).parent().children('.sub_info').remove();
		// if this has been already clicked, the user is trying to minimize it
		if($(this).hasClass("schedule_selected")){
			$(this).removeClass("schedule_selected");
			// check to remove from the first row
			$(this).removeClass("schedule_last_selected");
			$(this).removeClass("schedule_first_selected");
			// check to remove from last row
			
		}else{
			// user has requested this sub block, so we are going to show the schedule detail
			$(this).parent().children(".schedule_row").removeClass("schedule_hover schedule_selected schedule_first_selected schedule_last_selected");
			
			// this demarcates a selected leg
			$(this).addClass("schedule_selected");
			// check for first child based on the classes the hover function added
			if($(this).hasClass("schedule_first")){
				$(this).addClass("schedule_first_selected");
				
				// Draw the route between the origin and the origin port
				var parentid = $(this).attr('id');
				var originPortId = parentid.substring(0, parentid.indexOf(":"));
				$.ajax({
            		url: 'map/get_port_name_country',
            		dataType: 'json',
            		type: 'POST',
            		data: ({port_id: originPortId}),
            		success: function(data){
            			var start = $('#origin').val();
            			var endLat = data.port.lat;
            			var endLon = data.port.lon;
            			// clear the map before drawing
            			ClearMap();
                       	// draw the route
            			var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + endLat+","+endLon + "&routePathOutput=Points&output=json&jsonp=DrawRoute&jsonso=d"+originPortId+"&key=" + credentials;
                        CallRestService(routeRequest);
                        // put a pin at origin
            			var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + start + "?output=json&jsonp=GeocodeCallback&key="+credentials;
                       	CallRestService(geocodeRequest);
                       	// put a pin at origin port
                       	AddPushPin(endLat, endLon);
            		}
            	});
            	var htmlText = '<div class="sub_info">'+
				    '<div id="d'+originPortId+'">'+
      				    'Loading Distance'+
      				'</div>'+
      			'</div>';
      			var insertDiv = $(htmlText).hide();
            	insertDiv.insertAfter($(this).parent().children(":last-child")).slideDown();
            	// add the sub info class to the sub info div
            	$(this).parent().children(".sub_info").addClass('sub_info_first');
            	
			}
			// check for last child based on the classes the hover function added
			else if($(this).hasClass("schedule_last")){
				$(this).addClass("schedule_last_selected");
				
				// Draw the route between the origin and the origin port
				var parentid = $(this).attr('id');
				var destPortId = parentid.substring(parentid.indexOf(":")+1, parentid.lastIndexOf(":"));
				$.ajax({
            		url: 'map/get_port_name_country',
            		dataType: 'json',
            		type: 'POST',
            		data: ({port_id: destPortId}),
            		success: function(data){
            			var start = $('#destination').val();
            			var endLat = data.port.lat;
            			var endLon = data.port.lon;
            			// clear the map before drawing
            			ClearMap();
                       	// draw the route
            			var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + endLat+","+endLon + "&routePathOutput=Points&output=json&jsonp=DrawRoute&jsonso=d"+destPortId+"&key=" + credentials;
                        CallRestService(routeRequest);
                        // put a pin at destination
            			var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + start + "?output=json&jsonp=GeocodeCallback&key="+credentials;
                       	CallRestService(geocodeRequest);
                       	// put a pin at destination port
                       	AddPushPin(endLat, endLon);
            		}
            	});
            	var htmlText = '<div class="sub_info">'+
				    '<div id="d'+destPortId+'">'+
				        'Loading Distance'+
      				'</div>'+
      			'</div>';
      			var insertDiv = $(htmlText).hide();
            	insertDiv.insertAfter($(this).parent().children(":last-child")).slideDown();
			}
			// it is a middle element
			else {
			    var element = $(this);
			    var parentid = $(this).attr('id');
				var originPortId = parentid.substring(0, parentid.indexOf(":"));
				var destPortId = parentid.substring(parentid.indexOf(":")+1, parentid.lastIndexOf(":"));
			    $.ajax({
            		url: 'map/lookup_route_services',
            		dataType: 'json',
            		type: 'POST',
            		data: ({start_port_id: originPortId, end_port_id: destPortId}),
            		success: function(data){
            			
            			var htmlText = '<div class="sub_info">'+PrintScheduleInfo(data.headings, data.services)+'</div>';
            			var insertDiv = $(htmlText).hide();
            			//console.log(insertDiv);
            			insertDiv.insertAfter(element.parent().children(":last-child")).slideDown();
            			
            			
            		}
            	});
			    
			    // this is where have to make the ajax call to create the sub html
    			
			}
		}// end if
	});
	
}

// print the schedules
function PrintSchedules (origin, destination, combinations) {
    $('#schedule_list').remove();
    var originText = origin[0];
    var destinationText = destination[0];
    var htmlText = '<div id="schedule_list">';
    for(var i in combinations){
        var combo = combinations[i];
        var key = combo.start_port_id+":"+combo.end_port_id;
        htmlText += '<div class="schedule">'
        htmlText += '<div id="'+key+':1" class="schedule_row">'+originText+'&rarr;'+combo.start_port_name+'</div>';
        htmlText += '<div id="'+key+':2" class="schedule_row">'+combo.start_port_name+'&rarr;'+combo.end_port_name+'</div>';
        htmlText += '<div id="'+key+':3" class="schedule_row">'+combo.end_port_name+'&rarr;'+destinationText+'</div>';
        htmlText += '<div class="schedule_info">'+
			'<span class="transit_time">58</span> days'+
			'<span class="transit_time">Evergreen</span>'+
		    '</div>';
		htmlText += '</div>';
    }
    htmlText += '</div>';
    $("#mapDiv").after(htmlText);
    attachHandlers();
    
    $("#overlay").hide('slow', function() {
        $("#mapDiv").show();
      });
}



function PrintScheduleInfo(headings, services){
    var headingText = '';
    var monthLines = '';
    for (var month in headings){
        headingText += '<div class="schedule_header_month_container" style="left: '+headings[month]+'%">';
        headingText += '<div class="month_heading">'+month+'</div>';
        headingText += '</div>';
        monthLines += '<div class="month_line" style="left: '+headings[month]+'%"></div>';
    }
    
    var htmlText = '<div class="schedule_sub_info">';
    htmlText += '<div class="schedule_time_header">';
    htmlText += '<div class="head_block">';
    htmlText += headingText;
    // end schedule time header and head block
    htmlText += '</div></div>';
    
    htmlText += '<div class="schedule_times">';
    htmlText += '<div class="linepane">';
    htmlText += monthLines;
    // end of line pane
    htmlText += '</div>';
    
    
    for (var service in services){
        console.log("Ship Name: "+services[service].ship_name+" Voyage Id: "+services[service].voyage_id+ " Route ID: "+services[service].route_id);
        htmlText += '<div class="time_row time_row_border">';
        htmlText += '<div id='+services[service].ship_name.replace(/\s/g, 'nbsp;')+':'+services[service].voyage_id.replace(/\s/g, 'nbsp;')+':'+services[service].route_id+' class="time_row_sub" style="left: '+services[service].left+'%; width: '+services[service].width+'%; background-color: '+services[service].background_color+'; border-color: '+services[service].border_color+';">';
        htmlText += '<span class="full-name">'+services[service].ss_line+'</span>';
        // end time row sub
        htmlText += '</div>';
        // end time row
        htmlText += '</div>';
    }
    
    // end line pane
    htmlText += '</div>';
    // end schedule_sub_info
    htmlText += '</div>';
    
    return htmlText;
}


function PrintToolTipWaiting(left, top, route_id, voyage_id, ship_name,carrier){
    console.log("in tool tip waiting");
    // subtract by half the size of the div, in css so we can center the popup
    left = parseInt(left) - 150;
    // subtract the height of the div plus padding so we can place it above
    top = parseInt(top) - 250 - 17;
    var htmlText = '<div id="popup_info" style="left:'+left+'px; top:'+top+'px;">';
    htmlText += '<div id="popup_heading">'
    htmlText +=   '<div class="info_row">';
    htmlText +=        '<div class="info_heading">ship_name:</div>';
    htmlText +=        '<div class="info_value">'+ship_name+'</div>';
    htmlText +=    '</div>';
    htmlText +=    '<div class="info_row">';
    htmlText +=        '<div class="info_heading">voyage:</div>';
    htmlText +=        '<div class="info_value">'+voyage_id+'</div>';
    htmlText +=    '</div>';
    htmlText +=    '<div class="info_row">';
    htmlText +=        '<div class="info_heading">number of days:</div>';
    htmlText +=        '<div id="info_num_days" class="info_value">Loading...</div>';
    htmlText +=    '</div>';
    htmlText +=    '<div class="info_row">';
    htmlText +=        '<div class="info_heading">carrier:</div>';
    htmlText +=        '<div class="info_value">'+carrier+'</div>';
    htmlText +=    '</div>';
    htmlText += '</div>'; // end pop up heading
    htmlText += '<div id="ports_loading">';
    htmlText += '<div class="wraptocenter" style="display: block; margin-bottom: auto;margin-left: auto;margin-right: auto;padding-top: 25%;width: 100%;">';
    htmlText += '<img style="align: center" src="'+$('#loading').attr('src')+'" />';
    htmlText += '</div>';
    htmlText += '</div>'; // end ports container
    htmlText += '</div>'; // end pop up info
    
    return htmlText;
}

function PrintToolTipDone (ports) {
    console.log("in tool tip done");
    var htmlText = '<div id="ports_container">';
    htmlText += '<table>';
    htmlText +=     '<tr><th>Port</th><th>ETA</th><th>ETD</th></tr>';
    for (var i in ports){
        htmlText +=     '<tr>';
        htmlText += '<td>'+ports[i].port+'</td>';
        var etaDate = parseDate(ports[i].eta);
        var etdDate = parseDate(ports[i].etd);
        //console.log("Etd Date Parsed: "+ports[i].etd+" Eta Date: "+etdDate+ " Eta Date: "+ports[i].eta+" Eta Date Parsed: "+etaDate);   
        htmlText += '<td>'+etaDate.format('mmm dd, yyyy')+'</td>';
        htmlText += '<td>'+etdDate.format('mmm dd, yyyy')+'</td>';
        htmlText +=     '</tr>';
    }
    htmlText += '</table>';
    htmlText += '</div>';
    
    return htmlText;
}
