// on click of result row links
$("li.active a").live('click', function(){
	// handle click on the link within the results
	var resultDiv = $(this).parents('.result');
	var resultRowDiv = $(this).parent('div');
	var parentDivIndex = $(resultDiv).children('.result-row').index(resultRowDiv);
	// simulate click on the detail box, corresponding to the link clicked
	$('.results-detail-box:eq('+parentDivIndex+')').click();
	console.log("Parent Div Index:", parentDivIndex, "Result Div:", resultDiv, "Result Row Div:", resultRowDiv, "This:", $(this));
});

// click of delete result button
$(".close-button").live('click', function(event) {
    $(this).closest('li').unbind('click').hide('slow', function(){ $(this).remove(); });
});

// on click of result row
$('#selectable > li').live('click', function(event){
	// if close button image clicked do nothing, we just want to close it out only
	//console.log("node name:", event.target.nodeName, "class type:", $(this).hasClass("inactive"), "element:", $(this), "classes:", $(this).attr('class'));
	if(!$(this).hasClass('active') && event.target.nodeName == 'DIV'){
		$(this).removeClass('hover inactive');
		$("#selectable>li.active").removeClass('active').children(".close-button").attr('src', "assets/img/unhighlighted_close.png");
		$(this).addClass('active');
		$(this).children(".close-button").attr('src', "assets/img/highlighted_close.png");

		// holders of results detail width and height
		var resultsDetailWidth = parseInt($('#results-detail').width());
		var resultsDetailHeight = parseInt($('#results-detail').height());

		// results detail animation
		// set all the css to prepare for animation
		// if it is still being animated, example too many clicks too fast
		// bring it back into the screen

		// get the port id and text from the divs to figure out what to show in the detail boxes
		$(this).find(".result-row").each(function(key, value){
			$(".results-detail-box:eq("+key+")").html(htmlForDetailBox(value));
			// simulate click, so arrow and loading of map data is done on the first box
			// when the box slide backs in the data is filled up
			$('.results-detail-box:first').click();
		});
	}// end if
});// end click result row

// on click of boxes in detail
$('.results-detail-box').live('click', ResultDetailBoxClicked);