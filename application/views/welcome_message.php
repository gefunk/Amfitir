<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Welcome to Shipment Exchange</title>
	<script charset="UTF-8" type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/infobox_plugin.js"></script>
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/pepper-grinder/jquery-ui-1.8.10.custom.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/main.css" rel="stylesheet" />
	<script language="javascript">
	$(document).ready(function() {

		var map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {credentials:"AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS"});

		$('#routes').button();

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
							console.log("Could not find city id: "+ui.item.value);
						}
					}
				});
				
			 	$(this).val(ui.item.label);
			}

		}); // end of autocomplete
		
		$('#routes').click(function(){
			var origin_city_id = $('#origin_city').val();
			$.ajax({
				url: '<?php echo base_url(); ?>index.php/welcome/get_ports',
				dataType: 'json',
				type: 'POST',
				data: ({origin_city_id: origin_city_id}),
				success: function(data){
					if(data.response == 'true'){
						addPointsToMap(data.message, map);
					}
				}
			});
		});
		
		
	});

	function changeToCity(latitude, longitude, map){
		// Define the pushpin location
		var loc = new Microsoft.Maps.Location(latitude, longitude);
		// Add a pin to the map
		var pin = new Microsoft.Maps.Pushpin(loc); 
		map.entities.push(pin);

		// Center the map on the location
		map.setView({center: loc, zoom: 5});
	}
	
	
	function addPointsToMap(data, map){
	
		var points = new Microsoft.Maps.EntityCollection();

		for(var i=0; i < data.length; i++){
			var pointname = data[i].name; 
			var latitude = data[i].latitude
			var longitude = data[i].longitude;
		
			var loc = new Microsoft.Maps.Location(latitude, longitude);
			// Add a pin to the map
			var pin = new Microsoft.Maps.Pushpin(loc, {text: pointname}); 
			
			// Create the infobox for the pushpin
			var infobox = Microsoft.Maps.Ext.InfoBox(
		    	pointname, /* <-- InfoBox Title to display */
			    "This is at latitude: "+latitude+", longitude: "+longitude, /* <-- InfoBox Description to display */
			    map /* <-- A refernce to the Map where the InfoBox will be displayed */
			);

			pin.setInfoBox(infobox);
	        
	        points.push(pin);
	        
	        
		}// end for loop
		
		map.entities.push(points);

	}
		
	</script>
</head>

<body style="margin-left: auto; margin-right: auto; width: 960px">
	
	<table style="width: 90%">
		<tr>
			<td>
				<div class="ui-widget">
					<label for="origin_city">From:</label><input style="width: 80%" type="text" name="origin_city" class="cities" value="" id="origin_city">
				</div>
			</td>
			<td>
				<div class="ui-widget">
					<label for="destination_city">To</label><input  style="width: 80%" type="text" name="destination_city" class="cities" value="" id="destination_city">
				</div>
			</td>
			<td>
				<div id="routes" class="ui-widget">Find Route(s)</div>
			</td>
		</tr>
	</table>
	
	<div id='mapDiv' style="position: absolute; width:800px; height:400px;"></div>
	
	
</body>
</html>