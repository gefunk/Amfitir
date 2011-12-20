$(document).ready(function() {

	var map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {credentials:"AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS"});
	
	// allows results to be sortable
	$( ".sortable" ).sortable({
		placeholder: "ui-state-highlight"
	});
	
	// on click of result row
	$('#selectable > li').live('click', function(event){
		// if close button image clicked do nothing, we just want to close it out only
		if(event.target.nodeName != 'IMG'){
			$(this).removeClass('hover inactive');
			$("#selectable>li.active").removeClass('active').children(".close-button").attr('src', "<?php echo base_url(); ?>assets/img/unhighlighted_close.png");
			$(this).addClass('active');
			$(this).children(".close-button").attr('src', "<?php echo base_url(); ?>assets/img/highlighted_close.png");
		}
	});
	
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
	
	// click of delete result button
	$(".close-button").live('click', function(event) {
	    $(this).closest('li').unbind('click').hide('slow', function(){ $(this).remove(); });
	});
	
	// hover the left side boxes
	$('.results-detail-box').live(
		{
			mouseenter:
				function () {
					if(!$(this).hasClass('results-detail-box-selected')){
						$(this).addClass('results-detail-box-hover');
					}
		 		},
		 	mouseleave:
	  			function () {
					if(!$(this).hasClass('results-detail-box-selected')){
			    		$(this).removeClass('results-detail-box-hover');
					}
	  			}
		}
	);
	
	// on click of boxes in detail
	$('.results-detail-box').live('click', function(event){
		var prevSelectedBox = $('.results-detail-box-selected');
		var prevOffset = prevSelectedBox.offset();
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
		
		
		
		
		
	});
	
});