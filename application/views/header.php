<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
   <head>
      <title>Amfitir - Your Best Source For Sailing Schedules</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>

      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/json2.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery-ui.js"></script>
      <link type="text/css" href="<?php echo base_url(); ?>assets/css/pepper-grinder/jquery-ui-1.8.10.custom.css" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?3.3.0/build/cssreset/reset-min.css&3.3.0/build/cssfonts/fonts-min.css&3.3.0/build/cssgrids/grids-min.css">
    <link type="text/css" href="<?php echo base_url(); ?>assets/css/global.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/header.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/footer.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/custom-theme/jquery-ui.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/calendar.css" rel="stylesheet" />
	<script src="http://cdn.jquerytools.org/1.2.6/tiny/jquery.tools.min.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/typewatch.js"></script>
	<!-- global js -->
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/global.js"></script>	
	<!-- footer page stuff -->
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/footer.js"></script>
	<!-- load all search page css and js -->
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/search.css" rel="stylesheet" />
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/tab.css" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/search/page.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/date.js"></script>
	<!-- loading all the result page css and js -->
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/result.css" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/result/page.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/result/map.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/result/helper.js"></script>
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/calendar.js"></script>
	<!-- loading page stuff -->
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/loading_screen.css" rel="stylesheet" />
	
	<!-- contact page -->
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/contact.css" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/contact/page.js"></script>
	
	<!-- sign up page -->
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/signup.css" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/signup.js"></script>
	
	
	<link type="text/css" href="<?php echo base_url(); ?>assets/css/thankyou.css" rel="stylesheet" />
	
	<script language="javascript">

		$(function() {
			
			
			AttachIconsHandler();
		
			// initialize map
			map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),{credentials: credentials});
			console.log("map initialized",map);
			// load driving directions
			LoadDirectionsModule();
			// hide the map
			//$('#mapDiv').show();
			
		});
		
	</script>
	
	<!-- google analytics -->
	<script type="text/javascript">

	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-26691697-1']);
	  _gaq.push(['_trackPageview']);

	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();

	</script>
	
   </head>
   <body>
	<div id="header" class="drop-shadow-border">
		<?php $page_name = end($this->uri->segments); ?>
		<ul id="main-navigation">
			<li class="selectable <?php if($page_name == ''){echo "active";} ?>"  ><a href="<?php echo base_url(); ?>">home</a></li>
			<li class="selectable"><a>about</a></li>
			<li class="selectable <?php if($page_name == 'contact'){echo "active";} ?>"  ><a href="<?php echo base_url(); ?>contact">contact</a></li>
			<li><img id="header-title" src="assets/img/logo.png"></img></li>
			<li id="settings-icon" class="icon selectable">
				<img src="assets/img/settings-icon.png" />
			</li>
			<li id="user-icon" class="icon selectable">
				<img src="assets/img/user-icon.png" />		
			</li>
			<li class='user-name'>
				Sign in
			</li>
		</ul>

	</div>

	<div id="user-menu" class="drop-down-menu">
		<ul>
			<li><a>Sign in</a></li>
			<li id="sign-up"><a href="signup">Sign up</a></li>
		</ul>
	</div>
	<div id="settings-menu" class="drop-down-menu">
		<ul>
			<li><a>Settings</a></li>				
		</ul>
	</div>

	
	<div id="mapDiv"></div>