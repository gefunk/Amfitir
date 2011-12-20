	// workspaces script
	
	$("#workspaces li img").live(
		{
			mouseenter:
				function () {
			    	$(this).attr("src", "assets/img/workspace_close_hover.png");
		 		},
		 	mouseleave:
	  			function () {
			    	$(this).attr("src", "assets/img/workspace_close.png");
	  			},
			click:
				function(){
					// remove this workspace from the session
					var workspace_id = $(this).parent().attr('id');
					// send ajax call to remove workspace from session
					$.post('main/remove_workspace', {workspace_id: workspace_id});
					// check if this is the currently active workspace
					console.log("is Selected:", $(this).parent().hasClass('workspace-selected'));
					if($(this).parent().hasClass('workspace-selected')){
						// show previous workspace, if none show search screen
						console.log("Parent Prev:", $(this).parent().prev(), "Next:", $(this).parent().next(), "next parent new workspace:",$(this).parent().next().hasClass('new-workspace'));
						if($(this).parent().prev().length > 0){
							$(this).parent().prev().click();
						}else if($(this).parent().next().length > 0 && !($(this).parent().next().hasClass('new-workspace'))){
							console.log("Click on next parent");
							$(this).parent().next().click();
						}else{
							// click new workspace
							console.log("Clicking new workspace");
							$("#workspaces li.new-workspace").click();
						}
					}
					
					
					$(this).parent().remove();
					
					
				}
		}
	);
	
	// initialize the new workspace link, hide it initially
	$("#workspaces li.new-workspace").live('click', function(){
		// hide the map
		$("#mapDiv").hide();
		// unhighlight old selected workspace
		$("#workspaces > li").removeClass('workspace-selected');
		// add new workspace tab
		$("#workspaces > li").eq(-1).before("<li class='workspace-selected'>New Search</li>");
		// load the search screen
		$("#content").load("main/search #content");
		// after click hide, we show it only on the results page
		$(this).hide();
	});
	
	$("#workspaces li:not(.new-workspace,.workspace-selected)").live('click', function(event){
		// check if user meant to close out this workspace
		if(event.target.nodeName != 'IMG'){
			// unhighlight old selected workspace
			$("#workspaces li").removeClass('workspace-selected');
			// highlight currently clicked workspace
			$(this).addClass('workspace-selected');
			// replace the content with the content from the old workspace
			var workspace_id = $(this).attr('id');
			console.log("Attempting to retrieve workspace:",workspace_id);
			$("#content").load("main/retrieve_workspace #content", {workspace_id: workspace_id}, 
			function(){
				console.log("Results Page is loaded");
				LoadPageHandlers();
				LoadMap();
			});
		} //end if
		
	});