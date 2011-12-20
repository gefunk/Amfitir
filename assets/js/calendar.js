
// lookup Month
var month=new Array(12);
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";

var depart_date_clicked;
var arrive_date_clicked = null;
var $elementsToHighlight;
var today = new Date();

function initCalendars(numberOfCalendars, numberOfColumns, elementToAppend, calendarStartDate){
	
	
	elementToAppend.before(GenerateCalendars(numberOfCalendars, numberOfColumns, calendarStartDate));
	
	$("#calendar-container").live({
			click: 
				function(event){
					var target = event.target; // target grabs the node that triggered the event
					$target = $(target); // wrap in jquery object
					console.log("target Name", target.nodeName.toLowerCase());
	
					// check if one of the td's has been clicked
					if(target.nodeName.toLowerCase() == 'td' && !$target.hasClass("inactive") 
						&& $target.attr('id') != ("left-calendar") && $target.attr('id') != ("right-calendar")){
						// if arrive date is null
						if(depart_date_clicked != null && arrive_date_clicked == null){
							console.log("In Arrival Date Clicked", arrive_date_clicked);
							arrive_date_clicked = $target.attr('id');
							$target.addClass('arrive-clicked');
							if($elementsToHighlight != null)
								$elementsToHighlight.removeClass('calendar-hover').addClass('calendar-selected');
							$('#arrive').val(convertIdFormattedDateToReadableDate(arrive_date_clicked)).addClass('arrive-selected');
							$('#depart').removeClass('depart-selected');
						}else{
							// user clicking second time around, so clear out old clicked values from calendar
							if(depart_date_clicked != null && arrive_date_clicked != null){
								$("#"+depart_date_clicked).removeClass('depart-clicked');
								$("#"+arrive_date_clicked).removeClass('arrive-clicked');
								$("#calendar-container td").removeClass('calendar-selected');
							}
							arrive_date_clicked = null;
							depart_date_clicked = $target.attr('id');
							$target.addClass('depart-clicked');
							$('#arrive').removeClass('arrive-selected');
							if($elementsToHighlight != null)
								$elementsToHighlight.removeClass('calendar-hover').removeClass('calendar-selected');
							$('#depart').val(convertIdFormattedDateToReadableDate(depart_date_clicked)).addClass('depart-selected');
							console.log("Depart Date Selected");
						}
						
					}else if(target.nodeName.toLowerCase() == 'td' || target.nodeName.toLowerCase() == 'img'){
						console.log("Button Click");
						// we are moving the calendar left or right
						if($target.attr('id') == 'right-calendar' || $target.attr('name') == 'right-calendar'){
							GetNextCalendar();
							
						}else if($target.attr('id') == 'left-calendar' || $target.attr('name') == 'left-calendar'){
							GetPreviousCalendar();
							if(depart_date_clicked != null && arrive_date_clicked != null){
								$("#"+depart_date_clicked).addClass('depart-clicked');
								$("#"+arrive_date_clicked).addClass('arrive-clicked');
							}
						}
					}
				}
	});
	
	$("#calendar-container td").live({
		mouseenter:
			function(event){
				var target = event.target; // target grabs the node that triggered the event
				$target = $(target); // wrap in jquery object
				
				// check if one of the td's has been hovered
				if(target.nodeName.toLowerCase() == 'td'){
					// check if it is the right or left arrow
					if($target.hasClass('calendar-button')){
						$target.addClass("calendar-arrow-hover");
						if($target.attr('id') == 'right-calendar')
							$target.children("img").attr('src', 'assets/img/right_calendar_arrow_hover.png');
						else if($target.attr('id') == 'left-calendar')
							$target.children("img").attr('src', 'assets/img/left_calendar_arrow_hover.png');
							
					}
					// else it is a calendar td
					else if($target.attr('id') != null && !$target.hasClass('date-inactive')){
					
						if(depart_date_clicked != null && arrive_date_clicked == null){
							// remove previous highlighting
							if($elementsToHighlight != null)
								$elementsToHighlight.removeClass('calendar-hover');
							$elementsToHighlight = $(getAllCellsBetweenTheseDates(depart_date_clicked, $target.attr('id')));
							$elementsToHighlight.addClass('calendar-hover');
							console.log("Elements To Highlight", $elementsToHighlight);
							$target.addClass("arrive-hover");
						}else{
							$target.addClass("depart-hover");
						}
						
					}
				}
			},
		mouseleave:
			function(event){
				var target = event.target; // target grabs the node that triggered the event
				$target = $(target); // wrap in jquery object

				// check if one of the td's has been hovered
				if(target.nodeName.toLowerCase() == 'td'){
					if($target.hasClass('calendar-button')){
						$target.removeClass("calendar-arrow-hover");
						if($target.attr('id') == 'right-calendar')
							$target.children("img").attr('src', 'assets/img/right_calendar_arrow.png');
						else if($target.attr('id') == 'left-calendar')
							$target.children("img").attr('src', 'assets/img/left_calendar_arrow.png');
					}else{
						$target.removeClass("depart-hover arrive-hover");
					}
				}
				if($elementsToHighlight != null){
					$elementsToHighlight.removeClass('depart-hover arrive-hover');
				}
			}
	})
}


function TypeSelectDepartDate(depart_date_id){
	// user clicking second time around, so clear out old clicked values from calendar
	console.log("Depart Date Typed");
	if(depart_date_clicked != null ){
		$("#"+depart_date_clicked).removeClass('depart-clicked');
	}

	$target = $("#"+depart_date_id);
	depart_date_clicked = $target.attr('id');
	$target.addClass('depart-clicked');
	if(arrive_date_clicked != null){
		$elementsToHighlight.removeClass('calendar-selected');
		$elementsToHighlight = getAllCellsBetweenTheseDates(depart_date_clicked, arrive_date_clicked);
		$elementsToHighlight.addClass("calendar-selected");
	}else if($elementsToHighlight != null)
		$elementsToHighlight.removeClass('calendar-selected');
}

function TypeSelectArriveDate(arrive_date_id){
	if(arrive_date_clicked != null){
		$("#calendar-container td").removeClass('calendar-selected');
		$("#"+arrive_date_clicked).removeClass('arrive-clicked');
	}
	console.log("In Arrival Date typed", arrive_date_clicked);
	$target = $("#"+arrive_date_id);
	arrive_date_clicked = $target.attr('id');
	$target.addClass('arrive-clicked');
	$elementsToHighlight = getAllCellsBetweenTheseDates(depart_date_clicked, $target.attr('id'));
	$elementsToHighlight.addClass("calendar-selected");
}

function ClearDepartDate(){
	if(depart_date_clicked != null){
		$("#"+depart_date_clicked).removeClass('depart-clicked');
		depart_date_clicked = null;
		$elementsToHighlight.removeClass('calendar-selected');
	}
}

function ClearArriveDate(){
	if(arrive_date_clicked != null){
		$("#"+arrive_date_clicked).removeClass('arrive-clicked');
		arrive_date_clicked = null;
		$elementsToHighlight.removeClass('calendar-selected');
	}
}

function getAllCellsBetweenTheseDates(start_date, end_date){
	
	var elementsToReturn = $([]);
	
	var split_date = start_date.split('-');
	var start_day = parseInt(split_date[0]);
	var start_month = parseInt(split_date[1]);
	var start_year = parseInt(split_date[2]);
	
	split_date = end_date.split('-');
	var end_day = parseInt(split_date[0]);
	var end_month = parseInt(split_date[1]);
	var end_year = parseInt(split_date[2]);
	
	var $start_date_element = $("#"+start_date);
	var $end_date_element = $("#"+end_date);
	
	// check if we are in the same year
	if(start_year == end_year){
		// check if we are in the same month
		if(start_month == end_month){
			// check if we are in the same row
			var start_row_parent_id = $start_date_element.parent().attr('id').split('-')[0];
			var end_row_parent_id = $end_date_element.parent().attr('id').split('-')[0];
			console.log("Start Parent ID:",start_row_parent_id, "End Row Parent Id:",end_row_parent_id);
			if(start_row_parent_id == end_row_parent_id){
				// get position of start date in row
				var start_date_position_in_row = $start_date_element.index()+1;
				// get position of end date in row
				var end_date_position_in_row = $end_date_element.index();
				console.log("in Same Row Returning:",$start_date_element.parent().children().slice(start_date_position_in_row,end_date_position_in_row));
				// add the elements to be selected
				elementsToReturn = elementsToReturn.add($start_date_element.parent().children().slice(start_date_position_in_row,end_date_position_in_row));
				console.log("Elements",elementsToReturn);
			}
			// check if we are in the rows below start date row
			if(start_row_parent_id < end_row_parent_id){
				console.log("Row is below start row");
				// get position of start date in row
				var start_date_position_in_row = $start_date_element.index()+1;
				// select all the rows from the start to date to the end of its row
				elementsToReturn = elementsToReturn.add($start_date_element.parent().children().slice(start_date_position_in_row,$start_date_element.siblings(":last").index()+1));
				// get the rest of the row id to append to the beginning of the row id
				var attr_id = $start_date_element.parent().attr('id');
				append_to_row_id = attr_id.substring(attr_id.indexOf('-'),attr_id.length);
				// select the td in rows which are below the start date
				for(var row_to_select = parseInt(start_row_parent_id)+1; row_to_select < end_row_parent_id; row_to_select++){
					console.log("Selecting row:",row_to_select+append_to_row_id, "Should be adding these elsements", $("#"+row_to_select+append_to_row_id+" > td"));
					elementsToReturn = elementsToReturn.add($("#"+row_to_select+append_to_row_id+" > td"));
				}
				// select the beginning of the end row to the end date
				elementsToReturn = elementsToReturn.add($end_date_element.parent().children().slice($end_date_element.siblings(":first").index(),$end_date_element.index()+1));	
			}
		}
		// check if we are in the a calendar after the start date
		else if(end_month > start_month){
			
			// check if start date element is still on the screen
			if($start_date_element.length){
				// highlight all the dates to the end of the start date calendar
				// elements to the end of the row
				elementsToReturn = elementsToReturn.add($start_date_element.parent().children().slice($start_date_element.index()+1));
				// the rows after the start date row
				$start_date_element.parent().parent().children().slice(
					$("#"+$start_date_element.parent().attr('id')).index()+1
				).each(function(index){
						elementsToReturn = elementsToReturn.add($(this).children('td'));
				});
			}
			// the calendars which are in between the start calendar and the end calendar highlight them
			for (var month_id = parseInt(start_month)+1; month_id < end_month; month_id++){
				elementsToReturn = elementsToReturn.add($('#'+month_id+'-'+end_year+' td'));
			}
			
			// check if end date element is still on screen
			if($end_date_element.length){
				// the calendar which the end date ends in, get all the rows before the end date to highlight
				$end_date_element.parent().parent().children().slice(
					0,
					$("#"+$end_date_element.parent().attr('id')).index()
				).each(function(index){
						elementsToReturn = elementsToReturn.add($(this).children('td'));
				});
				// the dates before the end date
				elementsToReturn = elementsToReturn.add($end_date_element.parent().children().slice(0, $end_date_element.index()));
			}
		}
	}else if(start_year < end_year){
		// check if start date element is still on the screen
		if($start_date_element.length){
			// highlight all the dates to the end of the start date calendar
			// elements to the end of the row
			elementsToReturn = elementsToReturn.add($start_date_element.parent().children().slice($start_date_element.index()+1));
			// the rows after the start date row
			$start_date_element.parent().parent().children().slice(
				$("#"+$start_date_element.parent().attr('id')).index()+1
			).each(function(index){
					elementsToReturn = elementsToReturn.add($(this).children('td'));
			});
		}
		
		// highlight all the months of the calendar year which are in between start date and end of the year 
		for (var month_id = parseInt(start_month)+1; month_id < 12; month_id++){
			elementsToReturn = elementsToReturn.add($('#'+month_id+'-'+start_year+' td'));
		}
		
		// the calendars which are in from start of the year to the end calendar highlight them
		for (var month_id = 0; month_id < end_month; month_id++){
			elementsToReturn = elementsToReturn.add($('#'+month_id+'-'+end_year+' td'));
		}
		
		// check if end date element is still on screen
		if($end_date_element.length){
			// the calendar which the end date ends in, get all the rows before the end date to highlight
			$end_date_element.parent().parent().children().slice(
				0,
				$("#"+$end_date_element.parent().attr('id')).index()
			).each(function(index){
					elementsToReturn = elementsToReturn.add($(this).children('td'));
			});
			// the dates before the end date
			elementsToReturn = elementsToReturn.add($end_date_element.parent().children().slice(0, $end_date_element.index()));
		}
	}
	
	// check if we should highlight across multiple calendars
	return elementsToReturn;
	
}


/* pass in number of calendars and number of columns to print on */
function GenerateCalendars(numberOfCalendars, numberOfColumns, calendarStartDate){
	var calendarContainerHtml = '<table id="calendar-container">\n'+
		'<tr>\n<td id="left-calendar" class="calendar-button"><img name="left-calendar"  src="assets/img/left_calendar_arrow.png" /></td>\n'+
			'<td>\n';
	var currentDate = calendarStartDate;
	
	var columnCount = 0;
	for(var numCalendars = 0; numCalendars < numberOfCalendars; numCalendars++){
		if(columnCount > numberOfColumns-1){
			calendarContainerHtml += '</td></tr><tr><td>\n';
			columnCount = 1;
		}else{
			if (numCalendars > 0)
				calendarContainerHtml += '</td><td>\n';
			columnCount++;
		}
		// generate a new calendar
		calendarContainerHtml += GenerateNewCalendar(currentDate.getMonth(), currentDate.getFullYear());
		// go to the next month
		currentDate = nextMonth(currentDate);
		
	}
	
	// end calendar container html, all calendars should be encapsulated by this
	calendarContainerHtml +=	'</td>\n<td id="right-calendar" class="calendar-button"><img name="right-calendar" src="assets/img/right_calendar_arrow.png" /></td>\n'+
		'</tr>\n'+
	'</table><!-- end calendar container -->\n';
	
	return calendarContainerHtml;
}


function GetNextCalendar(){
	// get the id of the last calendar to figure out what the next calendar should be
	var last_calendar_id =  $("#calendar-container table.calendar:last").attr('id');
	var split_id = last_calendar_id.split('-');
	var or_month = parseInt(split_id[0]);
	var or_year = parseInt(split_id[1]);
	var new_month;
	var new_year = or_year;
	
	if(or_month == 11){
		new_year = or_year+1;
		new_month = 0;
	}else{
		new_month = or_month + 1
	}
	
	console.log("Next Month calendar about to generate", new_month, new_year, "original month, year", or_month, or_year);
	
	// remove the first calendar
	$("#calendar-container table.calendar:first").parent().fadeOut('fast', function(){
		$(this).remove();
		// append the new calendar to the end
		$("#calendar-container table.calendar:last").parent().after("<td>"+GenerateNewCalendar(new_month, new_year)+"</td>");
 		ReHighlightSelect();

	});
	
	
}


function GetPreviousCalendar(){
	// get the id of the first calendar to figure out what the previous calendar should be
	var last_calendar_id =  $("#calendar-container table.calendar:first").attr('id');
	var split_id = last_calendar_id.split('-');
	var or_month = parseInt(split_id[0]);
	var or_year = parseInt(split_id[1]);
	if(!(or_year == today.getFullYear() && or_month == today.getMonth())){
		var new_month;
		var new_year = or_year;
	
		if(or_month == 0){
			new_year = or_year-1;
			new_month = 11;
		}else{
			new_month = or_month - 1
		}
	
		console.log("Previous Month calendar about to generate", new_month, new_year, "original month, year", or_month, or_year);
	
		// remove the last calendar
		$("#calendar-container table.calendar:last").parent().fadeOut('fast', function(){
			$(this).remove();
			// add the new calendar to the beginning
			$("#calendar-container table.calendar:first").parent().before("<td>"+GenerateNewCalendar(new_month, new_year)+"</td>");
			 ReHighlightSelect();
		});
	}
}

/*
	will reselect and re-highlight the dates selected
	after going forward or backward in the calendar
*/
function ReHighlightSelect(){
	if(depart_date_clicked != null && arrive_date_clicked != null){
		$("#"+arrive_date_clicked).addClass('arrive-clicked');
		$("#"+depart_date_clicked).addClass('depart-clicked');
		$elementsToHighlight = $(getAllCellsBetweenTheseDates(depart_date_clicked, arrive_date_clicked));
		$elementsToHighlight.addClass('calendar-selected');
	}else if(depart_date_clicked != null){
		$("#"+depart_date_clicked).addClass('depart-clicked');
	}
}

/**
 Given month and year it will generate a calendar
*/
function GenerateNewCalendar(iMonth, iYear){
	var calendarhtml = '<table id='+iMonth+'-'+iYear+' class="calendar" border="0" cellspacing="5" cellpadding="5">\n'+
		'<tr>\n'+
			'<th colspan="5" class="calendar-month">'+month[iMonth]+'</th>\n'+
			'<th colspan="2" class="calendar-year">'+iYear+'</th>\n'+
		'</tr>\n'+
		'<tr>\n'+
			'<th>Sun</th>\n'+
			'<th>Mon</th>\n'+
			'<th>Tue</th>\n'+
			'<th>Wed</th>\n'+
			'<th>Thu</th>\n'+
			'<th>Fri</th>\n'+
			'<th>Sat</th>\n'+
		'</tr>\n';
		
	var firstDayOfMonth = new Date(iYear, iMonth, 1);

	// print new calendar
	calendarhtml += '<tr id='+'1'+'-'+iMonth+'-'+iYear+'-r'+'>\n';
	// keep track of which day of week we are on
	var dayOfWeekCounter = 0;
	// print empty td's until first day of month correct day of week
	for(var x=0; x < firstDayOfMonth.getDay(); x++){
		calendarhtml += '<td class="inactive"></td>\n';
		dayOfWeekCounter++;
	}

	console.log("First Day of Month",firstDayOfMonth.getDay(),"Day of Week Counter",dayOfWeekCounter);
	var numDaysInMonth = daysInMonth(firstDayOfMonth.getMonth(), firstDayOfMonth.getFullYear());
	// print td's for all the days in the month
	
	for(var dayInMonth = 1; dayInMonth <= numDaysInMonth; dayInMonth++){
		// everytime we reach the end of the week, start a new row
		if(dayOfWeekCounter % 7 == 0){
			var dayOfWeekId = (dayOfWeekCounter / 7) + 1;
			calendarhtml += '</tr><tr id='+dayOfWeekId+'-'+iMonth+'-'+iYear+'-r'+'>\n';
		}
		if(iYear == today.getFullYear() && iMonth == today.getMonth() && dayInMonth == today.getDate())
			calendarhtml += '<td id='+dayInMonth+'-'+iMonth+'-'+iYear+' class="today">'+dayInMonth+'</td>\n';
		else if(iYear == today.getFullYear() && iMonth == today.getMonth() && dayInMonth < today.getDate())
			calendarhtml += '<td id='+dayInMonth+'-'+iMonth+'-'+iYear+' class="date-inactive">'+dayInMonth+'</td>\n';
		else
			calendarhtml += '<td id='+dayInMonth+'-'+iMonth+'-'+iYear+'>'+dayInMonth+'</td>\n';
		dayOfWeekCounter++;
	}
	
	// print empty td's for the rest of the empty week
	while (dayOfWeekCounter % 7 != 0){
		calendarhtml += '<td class="inactive"></td>\n';
		if(iMonth == 11){
			console.log("Day Of Week Counter", dayOfWeekCounter, "Pr");
		}
		dayOfWeekCounter++;
	}
	// end the empty week row
	calendarhtml += "</tr>\n";
	
	// end new calendar
	calendarhtml+= "</tr></table>\n";
	
	//console.log("Printing calendar "+calendarhtml);
	
	return calendarhtml;
		
		
}

function GuessMonthDate(monthdate){
	var today = new Date();
	var guessedDate = Date.parse(monthdate);
	var guessedId = null;
	if(guessedDate != null){
		// if the guessed date is before today's date, then get the date in the next year
		if(guessedDate.getFullYear() < today.getFullYear() && guessedDate.getMonth() < today.getMonth()){
			guessedDate = new Date(today.getFullYear(), guessedDate.getMonth(), guessedDate.getDate());
		}
		guessedId = guessedDate.getDate()+"-"+guessedDate.getMonth()+"-"+guessedDate.getFullYear();
	}
	return guessedId;
}


function convertIdFormattedDateToReadableDate(datestr){
	var sparr = datestr.split('-');
	var day = sparr[0];
	var idmonth = sparr[1];
	var year = sparr[2];
	return month[idmonth] +' '+day+', '+year;
}

// delay function to use for delays
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();


function nextMonth (now) {
	var current = null;
	if (now.getMonth() == 11) {
	    current = new Date(now.getFullYear() + 1, 0, 1);
	} else {
	    current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	}
	
	return current;
}

/**
returns how many days there in the month
*/
function daysInMonth(iMonth, iYear){
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function fixId(myid) { // replaces special characters in id name 
        myid = myid.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
        return '#' + myid.replace(/(:|\.)/g,'\\$1');    
} // autoNumeric also requires brackets to be escaped