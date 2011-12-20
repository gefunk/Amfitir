
// load codeigniter base url
var CI = {
  'base_url': '<?php echo base_url(); ?>',
  'info_delay' : 5000
};


// gives an error, info, or warning box based on whats passed in
function GetMessageBox (msg, type) {
	$(".message").remove();
	var html = null;
	if (type== 0)
		html = '<div class="message error"><h3>Error</h3><p>'+msg+'</p></div>';
	else if(type == 1)
		html = '<div class="message info"><h3>Information</h3><p>'+msg+'</p></div>';
	else if(type == 2)
		html = '<div class="message warning"><h3>Warning</h3><p>'+msg+'</p></div>';
	return html;
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
}


function AttachIconsHandler(){
	$("body").live({
		click: 
			function(e){
				var target = e.target; // target grabs the node that triggered the event
				$target = $(target); // wrap in jquery object
								
				if($target.hasClass('icon') || $target.parent().hasClass('icon') ){

					$("#main-navigation > li.icon").removeClass('icon-selected');
					$(".drop-down-menu").hide();
					
					if($target.attr('id') == 'settings-icon'){
						$target.addClass('icon-selected');
						$("#settings-menu").show();
					}else if( $target.parent().attr('id') == 'settings-icon'){
						$target.parent().addClass('icon-selected');
						$("#settings-menu").show();
					}else if($target.attr('id') == 'user-icon'){
						$target.addClass('icon-selected');
						$("#user-menu").show();
					}else if($target.parent().attr('id') == 'user-icon'){
						$target.parent().addClass('icon-selected');
						$("#user-menu").show();
					}
				}else{
					$(".drop-down-menu").hide();
					$("#main-navigation > li.icon").removeClass('icon-selected');
				}
			}
		});
	
}