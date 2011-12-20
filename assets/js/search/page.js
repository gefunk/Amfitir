



$(window).load(function() {
	
	$(".input-row > input").live('focusin', function(){
		// remove all other focused
		$(this).siblings('label').animate({
			opacity: 1,
			color: '#0088CC'
		}, 800);
		
		if($(this).attr('id') == 'depart'){
			$("#depart").addClass('depart-selected');
			$("#arrive").removeClass('arrive-selected');
		}else if($(this).attr('id') == 'arrive'){
			$("#depart").removeClass('depart-selected');
			$("#arrive").addClass('arrive-selected');
		}
		
	});
	
	$(".input-row > input").live('focusout',function(){
		// remove all other focused
		$(this).siblings('label').animate({
			opacity: 0.7,
			color: '#000'
		});
		if($(this).val().length < 4){
			if($(this).attr('id') == 'depart'){
				ClearDepartDate();
			}else if($(this).attr('id') == 'arrive'){
				ClearArriveDate();
			}
		}
	
	});
	
	// click handlers
	$("#clear-button").live('click', function(){
		// animate the clearing
		$('.input-row > label').animate({
			opacity: 1,
			color: '#0088CC'
		}, 400, function(){
			// animation complete
			$('.input-row > input').val('');
			$(this).animate({
				opacity: 0.7,
				color: '#000'
			});
		});
	});
	
	$("#search-button").live('click', function(){
		// get index of the workspace li, that we want to represent this search
		if(validateSearchInputs()){
			var workspace_id = $(".workspace-selected").index("#workspaces li");
			console.log("Workspace Index:", workspace_id);
			var origin = $('#from').val();
			var destination = $('#to').val();
			var departure_date = GuessMonthDate($("#depart").val());
			var arrival_date = GuessMonthDate($("#arrive").val());
			
			// set loading image
			$("#content").load("main/loading #content");
			$("#content").load("main/result #content", {origin: origin, destination: destination, depart: departure_date, arrive: arrival_date, workspace_id: workspace_id}, 
			function(response, status, xhr){
				console.log("This is the status:",status, "Response Length:",response.length);
				if (status == "error") {
					$("#content").load("main/search #content", function(){
						var msg = "There has been an error, We are dispatching our best coffee drinkers to resolve this: ";
						$("#header").after(GetMessageBox(msg + xhr.status + " " + xhr.statusText, 0));
						$('.message').fadeIn('slow').delay(CI.info_delay).fadeOut('slow');
					});
				}else if(response.length == 0){
					$("#content").load("main/search #content", function(){
						var msg = "Excuse us, there are no results for that Origin and Destination, We are working hard to bring you more schedules, so it may be available later";
						$("#header").after(GetMessageBox(msg, 1)).fadeIn('slow');
						$('.message').delay(CI.info_delay).fadeOut('slow');
					});
				}else{
					console.log("Results Page is loaded");
					LoadPageHandlers();
					LoadMap();
				}
				
				
			});
		} // end validate search inputs
	});
	
	// capture enter key press
	$("#from, #to, #depart, #arrive").live('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
	 	if(code == 13) { //Enter keycode
		   //if enter was pressed click the search button
			console.log("Enter was pressed");
			$("#search-button").click();
		}
	});

/*	
	$("#depart, #arrive").live('keyup', function(){
		console.log("Key UP Event", $(this).attr('id'));
		// delay before trying to guess the date
		delay(function(){
				console.log("AFter Delay", $(this));
		      	// guess the date
				var guessedId = GuessMonthDate($(this).val());
				console.log("Trying to guess date: ", guessedId);
				if(guessedId != null && $("#"+guessedId).length > 0){
					$("#"+guessedId).click();
				}
		    }, 1000 );
	});*/
	


	// initialize javascript which gets called everyitme
	initSearchPage();
 
	
});

function initSearchPage(){
	var options = {
	    callback:
			function(){ 
				// get which element id we are trying to guess
				var element_id = $($(this).attr('el')).attr('id');
				// guess the date
				var guessedId = GuessMonthDate($(this).attr('text'));
				console.log("Trying to guess date: ", guessedId);
				if(guessedId != null && $("#"+guessedId).length > 0){
					
					if(element_id == 'depart'){
						TypeSelectDepartDate(guessedId);
					}else{
						TypeSelectArriveDate(guessedId);
					}
				}
			},
	    wait:750,
	    highlight:true,
	    captureLength:2
	}
	
	$("#depart").typeWatch( options );
	$("#arrive").typeWatch( options );
		
	// initialize calendars
	// number of calendars, number of columns, target to append to, date to start from
	initCalendars(2,2, $("#search-buttons"), new Date());
	
}

function activatePlaceholders() { 
	var detect = navigator.userAgent.toLowerCase(); 
	if (detect.indexOf("safari") > 0) {
		return false; 
	}
	var inputs = document.getElementsByTagName("input"); 
	for (var i=0;i<inputs.length;i++) { 
		if (inputs[i].getAttribute("type") == "text") { 
			if (inputs[i].getAttribute("placeholder") && inputs[i].getAttribute("placeholder").length > 0) { 
				inputs[i].value = inputs[i].getAttribute("placeholder"); 
				inputs[i].onclick = function() { 
					if (this.value == this.getAttribute("placeholder")) { 
						this.value = ""; 
					} 
					return false; 
				} 
				inputs[i].onblur = function() { 
					if (this.value.length < 1) { 
						this.value = this.getAttribute("placeholder"); 
					} 
				} 
			} 
		} 
	} 
}

/** validates the inputs in the search page **/
function validateSearchInputs(){
	var ret = true;
	var validatemsg = null;
	if(!$("#from").val()){
		validatemsg = "Please type in a From location";
		ret = false;
	}
	if(!$("#to").val()){
		if(validatemsg != null){
			validatemsg += " and a To location";
		}else{
			validatemsg = "Please type in a To location";
		}
		ret = false;
	}
	
	// update the info box and show the validation message
	if(!ret){
		$("#header").after(GetMessageBox(validatemsg, 0)).fadeIn('slow');
		$('.message').delay(CI.info_delay).fadeOut('slow');
	}
	
	return ret;
	
}