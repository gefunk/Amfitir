var data = ["Shipper","Importer","Exporter","Freight Forwarder","NVOCC","Customs Agent","Container Ship Operator/Owner","Liner Agent","Ship Broker"];

$(window).load(function() {
	$("#bus_type").autocomplete({source:data});	
	
	// click handlers
	$("#contact-buttons > .button:eq(0)").click(function(){
		// animate the clearing
		$('.label td').animate({
			opacity: 1,
			color: '#0088CC'
		}, 400, function(){
			// animation complete
			$('input').val('');
			$(this).animate({
				opacity: 0.7,
				color: '#000'
			});
		});
	});
	
	$("#contact-buttons > .button:eq(1)").click(function(){
		// validate that all req inputs have fields
		if(validateContactInputs()){
			saveContactInformation();
		}
		
	});
	
	
});

function checkNumeric (val) {
	var success = true;
	if(val != "") {
	    var value = val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	    var intRegex = /^\d+$/;
	    if(!intRegex.test(value)) {
	        success = false;
	    }
	} 
	return success;
}

/** validates the inputs in the search page **/
function validateContactInputs(){
	var ret = true;
	var validatemsg = null;
	if(!$("#name").val()){
		validatemsg = "Please type in your Name";
		ret = false;
	}
	
	if(!$("#email").val()){
		if(validatemsg != null){
			validatemsg += " and your email";
		}else{
			validatemsg = "Please type in your Email";
		}
		ret = false;
	}else if(!isValidEmailAddress($("#email").val())){
		if(validatemsg != null){
			validatemsg += " and a valid email address";
		}else{
			validatemsg = "Please type a valid Email address";
		}
		ret = false;
	}
	
	if(!$("#contact_msg").val()){
		if(validatemsg != null){
			validatemsg += " and a message";
		}else{
			validatemsg = "Please type in a Message";
		}
		ret = false;
	}
	
	
	// update the info box and show the validation message
	if(!ret){
		$("#header").after(GetMessageBox(validatemsg, 2)).fadeIn('slow');
		$('.message').delay(CI.info_delay).fadeOut('slow');
	}
	
	return ret;
	
}

function saveContactInformation(){
	$('#content').fadeTo('slow', 0.5, function() {
	      // Animation complete.
		$.ajax({
			url: 'main/save_contact_info',
			dataType: 'json',
			type: 'POST',
			data: (
					{
						name: $("#name").val(),
						email: $("#email").val(),
						company: $("#company").val(),
						telephone_no: $("#telephone").val(),
						business_type: $("#bus_type").val(),
						message: $("#contact_msg").val()
					}
				),
			success: function(data){ 
				$('#content').fadeTo('slow', 1, function() {
				      $("#contact-text").replaceWith("<p>Thank you for your message, if there is a follow up we will do our best to get back to you as soon as possible<p>");
					  $("table").remove();
				});
			}
		});
	});
	
}