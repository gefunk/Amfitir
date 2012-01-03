var timer;

$(window).load(function() {
	// submit button click
	$("#signup-buttons > .button:eq(1)").click(function(){
		if(validateInputs()){
			// submit the new user to the backend
			$("#new-user").submit();
		}
	});
	
	// clear button click
	$("#signup-buttons > .button:eq(0)").click(function(){
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
	
	$("#password").keyup(function(){		
		var self = $(this);
		if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout( function() {
			
			var percentage = checkPassWordStrength(self.val());
			console.log("Percentage of check password", percentage);
			if (percentage > 90) {
			    $("#password-strength").html("strong password").removeClass().addClass("strong");
				console.log("should have changed the text in the box to strong password");
	        } else if (percentage > 50) {
	            $("#password-strength").html("medium password").removeClass().addClass("medium")
	        } else if (percentage > 10) {
	            $("#password-strength").html("weak password").removeClass().addClass("weak");
	        } else {
	            $("#password-strength").html("type password").removeClass();
	        }
	
			if(self.val() != '' || $("#confirm-password").val() != ""){
				if($("#confirm-password").val() != ""){
					if((self.val() == $("#confirm-password").val())){
						$("#signup input.pass").removeClass("nomatch").addClass("match");
					}else{
						$("#signup input.pass").removeClass("match").addClass("nomatch");
					}
				}
        	}else{
				// the input fields are empty
				$("#signup input.pass").removeClass("nomatch").removeClass("match");
				$("#password-strength").html("type password").removeClass();
			}
        }, 300);
		
	});
	
	
	$("#confirm-password").keyup(function(){		
		var self = $(this);
		if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout( function() {
			
            	if(self.val() == $("#password").val()){
					$("#signup input.pass").removeClass("nomatch").addClass("match");
				}else{
					$("#signup input.pass").removeClass("match").addClass("nomatch");
				}
            
        }, 300);
		
	});
	
	// check user id in database
	$("#email").keyup(function(){
		var self = $(this);
		if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout( function() {
			// check if it is a valid email
			if(isValidEmailAddress(self.val())){
					// check userid is not registered in the db already
					$.ajax({
						url: 'navi/check_user_id_does_not_exist',
						dataType: 'json',
						type: 'POST',
						data: ({user_id: self.val()}),
						success: function(data){
							if(!data){
								// highlight it red
								$("#email").addClass("nomatch");
								// change the text to say this already exists
								var errorMessage = "This email is already registered, if you need to retrieve your password please click here";
								$("#header").after(GetMessageBox(errorMessage, 0)).fadeIn('slow');
								$('.message').delay(CI.info_delay);
							}else{
								// highlight it green
								$("#email").addClass("match");
								$('.message').fadeOut('slow');
							}
						}
					});
			}else{
				$("#email").removeClass();
			}
		
            
        }, 300);
	});
	
	
});


// validate inputs
function validateInputs(){
	var name = $("#name").val();
	var password = $("#password").val();
	var email = $("#email").val();
	
	var error = true;
	var errorMessage = "";
	
	if(!name) {
		errorMessage = "Please enter your name";
		error = false;
	}
	
	if (!email){
		if(error){
			errorMessage = "Please enter your email address";
			error = false;
		}else{
			errorMessage += " and your email address";
		}
	}
	// check if valid email
	else if(!isValidEmailAddress(email)){
		if(error){
			errorMessage = "Please enter a valid email address";
			error = false;
		}else{
			errorMessage += " and a valid email address";
		}
	}
	
	if (!password){
		if(error){
			error = false;
			errorMessage = "Please enter a password";
		}else{
			errorMessage += " and a password";
		}
	}else if($("#password").val() != $("#confirm-password").val()){
		if(error){
			error = false;
			errorMessage = "Please enter matching passwords";
		}else{
			errorMessage += " and matching passwords";
		}
		
	}
	
	// last because this trumps all other errors
	if($("#email").hasClass("nomatch")){
		errorMessage = "This email is already registered, if you need to retrieve your password please click here";
		error = false;
	}
	// check if there is an error to display
	if(!error){
		$("#header").after(GetMessageBox(errorMessage, 0)).fadeIn('slow');
		$('.message').delay(CI.info_delay).fadeOut('slow');
	}
	
	
	return error;
}



// checks strength of password and returns a number
function checkPassWordStrength(password) {
	var passwordLifeTimeInDays = 365;
	var passwordAttemptsPerSecond = 500;
    var expressions = [
	    {
	        regex : /[A-Z]+/,
	        uniqueChars : 26
	    },
	    {
	        regex : /[a-z]+/,
	        uniqueChars : 26
	    },
	    {
	        regex : /[0-9]+/,
	        uniqueChars : 10
	    },
	    {
	        regex : /[!.@$£#*()%~<>{}\[\]]+/,
	        uniqueChars : 17
	    }
	];

	var i, l = expressions.length, expression, possibilitiesPerLetterInPassword = 0;

    for (i = 0; i < l; i++) {

        expression = expressions[i];

        if (expression.regex.exec(password)) {
            possibilitiesPerLetterInPassword += expression.uniqueChars;
        }

    }

	 var totalCombinations = Math.pow(possibilitiesPerLetterInPassword, password.length);
	 	 // how long, on average, it would take to crack this
	 var crackTime = ((totalCombinations / passwordAttemptsPerSecond) / 2) / 86400;
	     // how close is the time to the expected lifetime?
	 var percentage = crackTime / passwordLifeTimeInDays;

	 return Math.min(Math.max(password.length * 5, percentage * 100), 100);

}
