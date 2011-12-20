
<div id="content">
			<!-- id to keep track of which workspace we are on, this also is put into the tab in the footer -->
			<input type="hidden" id="workspace_id" value="<?php echo $workspace_id ?>" />
	
	
			<div id="results-detail">
				<ul id="results-detail-routes">
					<li id="<?php echo $routes[0]['start_port_id'] ?>">
						<?php echo $origin ?> &rarr; <?php echo $routes[0]['start_port_name'] ?>
					</li>
					<li id="<?php echo $routes[0]['start_port_id'] ?>:<?php echo $routes[0]['end_port_id'] ?>">
						<?php echo $routes[0]['start_port_name'] ?>&rarr;<?php echo $routes[0]['end_port_name'] ?>
					</li>
					<li id="<?php echo $routes[0]['end_port_id'] ?>">
						<?php echo $routes[0]['end_port_name'] ?>&rarr;<?php echo $destination ?>
					</li>
				</ul>
				<div id="results-detail-text">
				</div>
			</div>

			<div id="results-container">
					<div id="results">
						<table id="results-control">
							<td class="results-reset">reset</span></td></tr>
						</table>
						<ul id="selectable" class="sortable">
							<?php foreach ($routes as $route): ?>
							<li class="inactive">
								<img class="close-button" src="<?php echo base_url(); ?>assets/img/unhighlighted_close.png" height="16" alt="Close" />
								<div class="result">
									<div id="<?php echo $route['start_port_id'] ?>" class="result-row"  name="searchable" data-tuple="<?php echo $route['start_port_name'] ?>">
										<a><?php echo $origin ?> &rarr; <?php echo $route['start_port_name'] ?></a>
									</div>
									<div id="<?php echo $route['start_port_id'] ?>:<?php echo $route['end_port_id'] ?>" class="result-row">
										<a><?php echo $route['start_port_name'] ?> &rarr; <?php echo $route['end_port_name'] ?></a>
									</div>
									<div id="<?php echo $route['end_port_id'] ?>" class="result-row" name="searchable" data-tuple="<?php echo $route['end_port_name'] ?>">
										<a><?php echo $route['end_port_name'] ?> &rarr; <?php echo $destination ?></a>
									</div>
								</div>
							</li>
							<?php endforeach; ?>
						</ul>


					</div>
				</div> <!-- end results container -->
	

	
	
</div><!-- end content -->