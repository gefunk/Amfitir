<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
   <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

      <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/json2.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery-ui.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/infobox_plugin.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/microsoft_maps.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/main_ui.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/date.format.js"></script>
      <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/helper.js"></script>
      <link href="<?php echo base_url(); ?>assets/css/schedule_timeline.css" rel="stylesheet" type="text/css" />
      <link type="text/css" href="<?php echo base_url(); ?>assets/css/pepper-grinder/jquery-ui-1.8.10.custom.css" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?3.3.0/build/cssreset/reset-min.css&3.3.0/build/cssfonts/fonts-min.css&3.3.0/build/cssgrids/grids-min.css">
      <link type="text/css" href="<?php echo base_url(); ?>assets/css/map.css" rel="stylesheet" />
   </head>
   <body>
       <div id="overlay" style="display:none; width:100%; height:100%; position: absolute; background-color:#fff;">
           <table height="100%" width="100%"><tr><td valign="center" height="100%" width="100%">
               <div align="center">
                   <table border="0" cellspacing="5" cellpadding="5">
                    <tr><td style="padding-right: 0.5em;"><img id='loading' src="<?php echo base_url(); ?>assets/img/ajax-loader.gif"></td>
                    <td><h1></img>Loading... Please Wait.</h1></td></tr>
                   </table>
               </div>
           </td></tr></table>
       </div>
       <div id="container">
           <div class="content">
           
           <table id="input">
               <tr>
                   <td>
                       <table class="block">
                           <tr><td><label for="origin">Origin:</label><input type="text" name="origin" id="origin"></td></tr>
                           <tr><td><span class="description">eg: 1600 Pennsylvania Ave NW Washington DC 20500</span></td></tr>
                       </table>
                   </td>
                   <td>
                       <table class="block">
                        <tr><td><label for="destination">Destination:</label><input type="text" name="destination" id="destination"></td></tr>
                        <tr><td><span class="description">eg: 1600 Pennsylvania Ave NW Washington DC 20500</span></td></tr>
                       </table>   
                   </td>
                   <td>
                       <input type="button" name="find" value="Find Location" id="find" />
                   </td>
               </tr>
           </table>
          <div id='mapDiv' style="margin: auto; position:relative; width:90%; height:400px; border: 1px solid #CCC"></div>
          </div>
          <div id="footer">
              <ul>
                  <li>about us</li>
                  <li>blog</li>
                  <li>jobs</li>
              </ul>
          </div>
      </div>
   </body>
</html>