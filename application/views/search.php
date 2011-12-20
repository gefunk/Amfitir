<div id="content">
	<div id="search-error" class="search-box-display" style="display: none;">
		<table border="0">
			<tr>
				<td><img src="<?php echo base_url(); ?>assets/img/error.png" /></td>
				<td class='text'>here is some information that should wrap around this whole thing</td>
			</tr>
		</table>
	</div>
	<div id="search-info" class="search-box-display" style="display: none;">
		<table border="0">
			<tr>
				<td><img src="<?php echo base_url(); ?>assets/img/caution.png" /></td>
				<td class='text'>here is some information that should wrap around this whole thing</td>
			</tr>
		</table>
	</div>
	
	<div id="search" class="main-box drop-shadow-search">
		<div id="search-title">
			<div id="search-header"><h1>Search Schedules</h1></div>
		</div>
		<div class="input-row">
			<label for="from">from</label>
			<input type="text"  name="from" value="" placeholder="city or address" id="from">
		</div>
		<div class="input-row">
			<label for="to" >to</label>
			<input type="text"  name="to" value="" placeholder="city or address" id="to">
		</div>
		<div class="input-row">
			<label for="depart" >depart</label>
			<input type="text"  name="depart" value="" placeholder="date" id="depart">
		</div>
		<div class="input-row">
			<label for="arrive" >arrive</label>
			<input type="text"  name="arrive" value="" placeholder="date" id="arrive">
		</div>
		<div id="search-buttons" class="bottom-buttons">
			<div id="clear-button" class="button">Clear</div>
			<div id="search-button" class="button">Search</div>
		</div>
	</div>
</div>