$(document).ready(function() {
	
	var map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {credentials:"AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS"});
	
	$( ".cities" ).autocomplete({
		source: function(request, response) {
			$.ajax({
				url: '<?php echo base_url(); ?>index.php/welcome/search_cities',
				dataType: 'json',
				type: 'POST',
				data: request,
				success:
					function(data)
					{
						if(data.response == 'true')
						{
							response(data.message);
						}
					}
			});
		},
		minLength: 4,
		select: function (event, ui){
			$.ajax({
				url: '<?php echo base_url(); ?>index.php/welcome/get_city_latlong',
				dataType: 'json',
				type: 'POST',
				data: ({city_id: ui.item.value}),
				success: function(data){
					if(data.response == 'true'){
						changeToCity(data.latitude, data.longitude, map);
					}else{
						console.log("Could not find city id: "+ui.item.value)
					}
				}
			});
		}
		
	});
});

function changeToCity(latitude, longitude, map){
	// Define the pushpin location
	var loc = new Microsoft.Maps.Location(latitude, longitude);
	// Add a pin to the map
	var pin = new Microsoft.Maps.Pushpin(loc); 
	map.entities.push(pin);

	// Center the map on the location
	map.setView({center: loc, zoom: 10});
}