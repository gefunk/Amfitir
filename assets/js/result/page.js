

// was document ready, now calling it from load function
function LoadPageHandlers() {

	// attach Window Resize Handler
	WindowResizeHandler();
	
	// set the workspace tab to show the search result
	/* not being used 
	var originstr = $("#results-detail-boxes > div:eq(0)").children(":first").html();
	originstr = jQuery.trim(originstr.split("<div")[0]);
	var deststr = $("#results-detail-boxes > div:eq(2)").children(":first").html();
	deststr = jQuery.trim(deststr.split("</div>")[1]);
	$(".workspace-selected").html(originstr+" &rarr; "+deststr+"<img src='assets/img/workspace_close.png' />").attr('id', $('#workspace_id').val());
	*/
	
	// allows results to be sortable
	$( ".sortable" ).sortable({
		placeholder: "ui-state-highlight"
	});
	
	// on the results page allow the user to add a new workspace
	// check if there are more than 6 or there is already a new search tab open
	/*
	if($("#workspaces > li").length <= 6 && $("#workspaces > li").eq(-2).attr('id') != null){
		$("#workspaces li.new-workspace").show();
	}
	*/
	
 	// Resize Map and EVerything else once page is loaded
	LoadMap();
	
	activatePlaceholders();
	
} // end load page handlers

$(window).load(function() {
	
	// using dom bubbling to make javascript more efficient
	$("#results-container").live({
		click: 
			function(e){
				var target = e.target; // target grabs the node that triggered the event
				$target = $(target); // wrap in jquery object
		
				// check if li or div has been clicked
				if(target.nodeName.toLowerCase() == 'li' || target.nodeName.toLowerCase() == 'div'){
					// get the li parent, which we need to do our operations on
					var $lielement = $target;
					// check if one of the child div's where clicked, get the li element 
					// depending on what was clicked
					if($target.is("div") && $target.parent().is("div")){
						$lielement = $target.parent().parent();
					}else if($target.is("div")){
						$lielement = $target.parent();
					}
			
					SelectResultRow($lielement);
					
				}else if(target.nodeName.toLowerCase() == 'a'){
					// on click of result row links
					var $lielement = $target.parent().parent().parent();
					// check if the parent li is active
					if($lielement.hasClass('active')){
						// handle click on the link within the results
						var resultDiv = $target.parent().parent();
						var resultRowDiv = $target.parent();
						var parentDivIndex = $(resultDiv).children('.result-row').index(resultRowDiv);
						// simulate click on the detail box, corresponding to the link clicked
						$('#results-detail-routes > li:eq('+parentDivIndex+')').click();
						console.log("Parent Div Index:", parentDivIndex, "Result Div:", resultDiv, "Result Row Div:", resultRowDiv, "This:", $(this));
					}else{
						SelectResultRow($lielement);
					}
				}else if(target.nodeName.toLowerCase() == 'img'){
					$target.parent().unbind('click').hide('slow', function(){ $(this).remove(); });
				}
			}// end click function
			
	}); // end results container selection
	
	

	// hover over the results
	$('#selectable > li').live(
		{
			mouseenter:
				function () {
			    $(this).addClass('hover');
				$(this).removeClass('inactive');
				$(this).children(".close-button").fadeIn(100);
		 		},
		 	mouseleave:
	  			function () {
			    $(this).removeClass('hover');
				$(this).addClass('inactive');
				$(this).children(".close-button").fadeOut(100);
	  			}
		}
	);
	

	

	
	// hover the top tabs
	$('#results-detail-routes > li').live(
		{
			click:
				function(){
					if(!$(this).hasClass('clicked')){
						// remove clicked from all siblings
						$(this).siblings('li').removeClass("clicked");
						// add class to clicked
						$(this).addClass('clicked');
						DetailBoxLoading();
						var elementText = $(this).text();
						var portId = $(this).attr("id");
						// get the index of the box that was clicked
						var elementIndex = $(this).parent().children().index($(this));
						// check which box was clicked
						if(elementIndex == 0){
							// the origin to origin port box was clicked
							var start = trim(elementText.split('→')[0]);
							LookupDistanceAndRouteToPort(start, portId, false);
						}else if(elementIndex == 1){
							// put the schedule calls in here
							var start_port_id = trim(elementText.split('→')[0]);
							var end_port_id = trim(elementText.split('→')[1]);
							
						}else if(elementIndex == 2){
							// the destination to destination port box was clicked
							var start = trim(elementText.split('→')[1]);
							LookupDistanceAndRouteToPort(start, portId, true);
						}

					}
				}
		}
	);
	

	
	// minimizes and maximizes results container
	/* not working
	$("#min").live('click', function() {
		if($("#results-container").width() == 300){
			//minimize everything
			MapResizeMinimizedResults();
			$("#results-detail").css("width", "100%");
			$("#selectable").hide();
		    $("#results-container").css('border-style', 'none none solid solid').height(25).width(25);
			console.log("Min got clicked");
		}else{
			$("#results").show();
		    $("#results-container").css('border-style', 'none none none solid;').height(25).width(300);
		}
		var clickEvents = $(this).data("events").click;
		jQuery.each(clickEvents, function(key, handlerObj) {
		  console.log(handlerObj.handler) // prints "function() { console.log('clicked!') }"
		})
		
	});
	
	
	$("#max").live("click",function(){
		console.log("max clicked"); // prints "function() { console.log('clicked!') }"
	});
	*/
		
		
	    
	
	
	

	
});// end document ready

/*
 handler for result row click
parameter is actual li element of result row
*/
function SelectResultRow($lielement){
	if(!$lielement.hasClass('active')){
		$lielement.removeClass('hover inactive');
		$("#selectable>li.active").removeClass('active').children(".close-button").attr('src', "assets/img/unhighlighted_close.png");
		$lielement.addClass('active');
		$lielement.children(".close-button").attr('src', "assets/img/highlighted_close.png");

		// get the port id and text from the divs to figure out what to show in the detail boxes
		$lielement.find(".result-row").each(function(key, value){
			$("#results-detail-routes > li:eq("+key+")").attr('id', $(this).attr('id')).html(htmlForDetailBox(value));
			// simulate click, so arrow and loading of map data is done on the first box
			// when the box slide backs in the data is filled up
			$('.results-detail-box:first').click();
		});
	}
}


// handler for Result Detail Box, it moves the arrow, highlights the box and 
// calls the map api to get the distance and moves the map to the correct spot
function ResultDetailBoxClicked(event){
	
	var prevSelectedBox = $('.results-detail-box-selected');
	var prevOffset = prevSelectedBox.offset();
	// check if this was clicked too quickly, the arrow hasn't stopped moving
	if(prevOffset != null){
		// show detail box loading animation
		DetailBoxLoading();
		
		
		// hide the original arrow from the box
		//$('.results-detail-box-selected').switchClass('results-detail-box-selected', 'results-detail-box-selected-no-arrow');
		$('.results-detail-box').removeClass('results-detail-box-selected');
		$(this).removeClass('results-detail-box-hover');
	
		// set the location of the transition arrow
		arrowWidth = parseInt($(".box-arrow").css('border-left-width'))+parseInt($('.box-arrow').css('border-right-width'));
		$(".box-arrow").css({
			'top': prevOffset.top+10,
			'left':prevOffset.left+102-arrowWidth,
		});
	
		borderArrowWidth = parseInt($(".box-arrow-border").css('border-left-width'))+parseInt($('.box-arrow-border').css('border-right-width'));
		$(".box-arrow-border").css({
			'top': prevOffset.top+8,
			'left':prevOffset.left+102-borderArrowWidth,
			'display': ''
		});
	
		// show the transition arrow
		$(".box-arrow").show();
		$(".box-arrow-border").show();
	
		// set this class to selected no arrow
		$(this).addClass('results-detail-box-selected-no-arrow',100);
	
		// animate the arrow from the currently selected location to the destination location
		var offset = $(this).offset();
		var destinationtop = offset.top + 10;
		$('.box-arrow, .box-arrow-border').animate({
			top: destinationtop+"px"
		}, 1000, function(){
			// after animation complete
			// set the selected class with arrow
			$('.results-detail-box-selected-no-arrow').removeClass('results-detail-box-selected-no-arrow').addClass('results-detail-box-selected');
			// hide the transition arrow
			$(".box-arrow").hide();
			$(".box-arrow-border").hide();
		});
	
		// show the correct data in the details area
		// get the index of the box that was clicked
		var elementIndex = $(".results-detail-box").index($(this));
	
		var portId = $(this).find("div:first").attr("id");
		var elementText = $(this).find("div:first").text();

		// check which box was clicked
		if(elementIndex == 0){
			// the origin to origin port box was clicked
			var start = trim(elementText.split('→')[0]);
			LookupDistanceAndRouteToPort(start, portId, false);
		}else if(elementIndex == 1){
			// put the schedule calls in here
		}else if(elementIndex == 2){
			// the destination to destination port box was clicked
			var start = trim(elementText.split('→')[1]);
			LookupDistanceAndRouteToPort(start, portId, true);
		}
	
	}
}

// handle window Resize Event
function WindowResizeHandler(){
	// resize static elements on window resize
	$(window).resize(function() {
	  	MapResize();
		ResultsContainerResize();
		ResultsDetailResize();
	});
}

// resize functions have to be above document.ready, otherwise
// there will be a not defined error
function ResultsContainerResize(){
	$("#results-container").height(GetResultsContainerHeight());
}

function GetResultsContainerHeight () {
	var headerHeight = 60;
	return getWindowHeight() - headerHeight;
}

function ResultsDetailResize(){
	var containerWidth = getWindowWidth()-(parseInt($("#results-container").width())+1);
	$("#results-detail").width(containerWidth);	
}


// given a start or end port looks up direction and distance 
function LookupDistanceAndRouteToPort(startPointText, portId, portIsOrigin){
	// get the location and draw the routes
	$.ajax({
		url: 'map/get_port_name_country',
		dataType: 'json',
		type: 'POST',
		data: ({port_id: portId}),
		success: function(data){
			var endLat = data.port.lat;
			var endLon = data.port.lon;
			// clear the map before drawing
			ClearMap();
			var cityLocation = new Microsoft.Maps.Directions.Waypoint({ address: startPointText });
			var portLocation = new Microsoft.Maps.Directions.Waypoint({ address: data.port.name, location: new Microsoft.Maps.Location(endLat, endLon) });
			// do driving directions
			if(portIsOrigin)
				createDrivingRoute(portLocation, cityLocation, 'results-detail-text');
			else
				createDrivingRoute(cityLocation, portLocation, 'results-detail-text');
           	/* draw the route
			var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + endLat+","+endLon + "&routePathOutput=Points&output=json&jsonp=DrawRoute&jsonso=results-detail-text&key=" + credentials;
            CallRestService(routeRequest);
            // put a pin at origin
			var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + start + "?output=json&jsonp=GeocodeCallback&key="+credentials;
           	CallRestService(geocodeRequest);
           	// put a pin at origin port
           	AddPushPin(endLat, endLon);
			*/
		}
	});
}

function htmlForDetailBox(value){
	var divid = $(value).attr('id');
	var str = trim($(value).text());
	var beg = trim(str.split('→')[0]);
	var end = trim(str.split('→')[1]);
	//console.log("Beginning: ", beg, "End: ", end);
	return beg+"&rarr;"+end;
}

function DetailBoxLoading(){
	// empty out results-detail-text and put in the loading animation
		$("#results-detail-text").html(
			"<div style='margin:120px auto;text-align:center;'><img src='assets/img/ajax-loader-big-000000.gif' /></div>"
		);
}

function DetailBoxFinishedLoading(){
	// clear the box of previous 
	$("#results-detail-text").empty();
	/* remove detail box loading animation
	$("#results-detail").animate({ backgroundColor: "#fff" }, 300,function(){
		$("#waiting").hide();
		$("#results-detail-text").show();
	});*/
}