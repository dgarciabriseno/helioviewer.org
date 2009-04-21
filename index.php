<?php $_SERVER['HTTP_HOST'] == "localhost" ? require_once('settings/Config.php') : require_once('settings/Config.Server.php'); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<?php printf("<!-- Helioviewer rev. %s, %s-->\n", Config::BUILD_NUM, Config::LAST_UPDATE);?>
		<title>Helioviewer - Solar and heliospheric image visualization tool</title>
		<link rel="shortcut icon" href="favicon.ico">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="Cache-Control" content="No-Cache">
		<meta name="description" content="Helioviewer - Solar and heliospheric image visualization tool">
		<meta name="keywords" content="Helioviewer, hv, jpeg 2000, jp2, solar image viewer, sun, solar, heliosphere, solar physics, viewer, visualization, space, astronomy, SOHO, EIT, LASCO, SDO, MDI, coronagraph, ">

		<!-- YUI CSS Reset -->
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?2.7.0/build/reset-fonts/reset-fonts.css"> 

		<!-- jQuery -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.1/jquery-ui.min.js" type="text/javascript"></script>
		<script src="lib/jquery/jquery-tooltip/jquery.tooltip.js" type="text/javascript"></script>
		<script src="lib/jquery/jquery-dynaccordion/ui.dynaccordion.js" type="text/javascript"></script>
		<link rel="stylesheet" href="lib/jquery/jquery.ui-1.7.1/css/dot-luv-modified/jquery-ui-1.7.1.custom.css" type="text/css" />	
		<script type="text/javascript">
			jQuery.noConflict();
		</script>

		<!-- Prototype and Scriptaculous -->
		<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js" type="text/javascript"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.2/scriptaculous.js?load=effects,slider,dragdrop,builder" type="text/javascript"></script>
		<script src="lib/prototype/mouse.wheel.js" type="text/javascript"></script>
		
		<!-- Prototip -->
		<script src="lib/prototip2.0.5/js/prototip.js" type="text/javascript"></script>
		<link rel="stylesheet" href="lib/prototip2.0.5/css/prototip.css" type="text/css">

		<!-- date.js -->
		<script src="lib/date.js/date-en-US.js" type="text/javascript"></script>
		
		<!-- CookieJar -->
		<script src="lib/CookieJar/cookiejar.js" type="text/javascript"></script>
		
		<!-- Simile -->
		<!--<script src="http://static.simile.mit.edu/timeline/api-2.2.0/timeline-api.js" type="text/javascript"></script>-->
		
		<!-- Pixastic -->
		<!-- jQuery("img.tile[src!=images/transparent_512.gif]"); -->
		<!--<script src="lib/pixastic/pixastic.custom.js" type="text/javascript"></script>-->

		<!-- ShadowBox -->
		<!--
		<script type="text/javascript" src="lib/shadowbox/src/adapter/shadowbox-prototype.js"></script>
		<script type="text/javascript" src="lib/shadowbox/src/shadowbox.js"></script>
		<script type="text/javascript" src="lib/shadowbox/src/skin/classic/skin.js"></script>
		<script type="text/javascript" src="lib/shadowbox/src/player/shadowbox-iframe.js"></script>
		<script type="text/javascript" src="lib/shadowbox/src/lang/shadowbox-en.js"></script>
		<link rel="stylesheet" href="lib/shadowbox/src/skin/classic/skin.css" type="text/css" media="screen">
		-->

		<!-- Helioviewer-Specific -->
		<script src="lib/helioviewer/UIElement.js" type="text/javascript"></script>
		<script src="lib/helioviewer/LoadingIndicator.js" type="text/javascript"></script>
		<script src="lib/helioviewer/Viewport.js" type="text/javascript"></script>
		<script src="lib/helioviewer/ViewportHandlers.js" type="text/javascript"></script>
		<script src="lib/helioviewer/Layer.js" type="text/javascript"></script>
		<script src="lib/helioviewer/TileLayer.js" type="text/javascript"></script>
		<script src="lib/helioviewer/EventLayer.js" type="text/javascript"></script>
		<script src="lib/helioviewer/EventMarker.js" type="text/javascript"></script>
		<script src="lib/helioviewer/ZoomControl.js" type="text/javascript"></script>
		<script src="lib/helioviewer/HelperFunctions.js" type="text/javascript"></script>
		<script src="lib/helioviewer/MessageConsole.js" type="text/javascript"></script>
		<script src="lib/helioviewer/LayerManager.js" type="text/javascript"></script>
		<script src="lib/helioviewer/EventLayerAccordion.js" type="text/javascript"></script>
		<script src="lib/helioviewer/TileLayerAccordion.js" type="text/javascript"></script>
		<script src="lib/helioviewer/Calendar.js" type="text/javascript"></script>
		<script src="lib/helioviewer/TimeControls.js" type="text/javascript"></script>
		<!--<script src="lib/helioviewer/EventTimeline.js" type="text/javascript"></script>-->
		<!--<script src="lib/helioviewer/MovieBuilder.js" type="text/javascript"></script>-->
		<script src="lib/helioviewer/IconPicker.js" type="text/javascript"></script>
		<script src="lib/helioviewer/UserSettings.js" type="text/javascript"></script>
		<script src="lib/helioviewer/Helioviewer.js" type="text/javascript"></script>
		<!--<script src="lib/helioviewer/build/helioviewer-all-min.js" type="text/javascript"></script>-->

		<!-- Helioviewer.org custom styles -->
		<link rel="stylesheet" type="text/css" href="styles/main.css">
		<link rel="stylesheet" type="text/css" href="styles/viewport.css">
		<link rel="stylesheet" type="text/css" href="styles/events.css">
		<link rel="stylesheet" type="text/css" href="styles/dialogs.css">
		<link rel="stylesheet" type="text/css" href="styles/tooltips.css">
		<link rel="stylesheet" type="text/css" href="styles/timenav.css">
		<link rel="stylesheet" type="text/css" href="styles/accordions.css">
		<link rel="stylesheet" type="text/css" href="styles/sliders.css">
		
		<!-- Theme Modifications -->
		<link rel="stylesheet" type="text/css" href="styles/dot-luv.css">
		
		<!--[if IE]>
			<link href="styles/main-ie.css" rel="stylesheet" type="text/css" />
		<![endif]-->
		
		<script type="text/javascript">
			Event.observe(window, 'load', function () {
				<?php
					//API Example: index.php?obs-date=1065512000&img-scale=2.63&layers=SOHEITEIT171,SOHLAS0C20WL
					if ($_GET['layers'])
						$layers = explode(",", $_GET['layers']);
				
					// View
					$view = array(
						'obs-date'  => $_GET['obs-date'],
						'img-scale' => $_GET['img-scale'],
						'layers'    => $layers
					);
                    printf("var view = %s;\n", json_encode($view));
               
                    echo "\t\t\t\t";
					
					// Default settings
					$settings = array(
                        'version'           => Config::BUILD_NUM,
						'defaultZoomLevel'  => Config::DEFAULT_ZOOM_LEVEL,
                        'minZoomLevel'      => Config::MIN_ZOOM_LEVEL,
                        'maxZoomLevel'      => Config::MAX_ZOOM_LEVEL,
                        'baseZoom'          => Config::BASE_ZOOM_LEVEL,
                        'baseScale'         => Config::BASE_IMAGE_SCALE,
                        'prefetchSize'      => Config::PREFETCH_SIZE,
	                    'timeIncrementSecs' => Config::DEFAULT_TIMESTEP,
                        'tileServer1'       => Config::TILE_SERVER_1,
                        'tileServer2'       => Config::TILE_SERVER_2,
                        'backupAPI'         => Config::BACKUP_API,
                        'backupEnabled'     => Config::BACKUP_ENABLED
					);
                    echo "var defaults = " . json_encode($settings) . ";\n";
                    echo "\t\t\t\t";
                    printf ("var api = '%s';\n", Config::API_BASE_URL);
				?>
				var helioviewer = new Helioviewer('helioviewer-viewport', api, view, defaults );
			});
		</script>

	</head>
	<body>
		<div id="minHeight"></div>
		<!-- Message Console -->
		<div id="message-console" style="display: none;">&nbsp;</div>

		<!-- Header and Content -->
		<div id="outsideBox">

			<!-- Left Column -->
			<div id="left-col">
				<div id="left-col-header">
					<img src="images/logos/simple.png" alt="Helioviewer.org Logo" style="margin-top:24px; margin-left: 9px;"></img>
				</div>
				<br><br>
				<div class="section-header" style="margin-left:5px; margin-top: 15px;">Observation</div> 
				<div id="observation-controls" class="ui-widget ui-widget-content ui-corner-all">
					<!--  Observation Date -->
					<div style="margin-bottom: 4px; position: relative;">
						<div style="width: 78px; margin-top:3px; float: left; font-weight: 600;">Date:</div>
						<input type="text" id="date" name="date" value="">
					</div>

					<!-- Observation Time -->
					<div style="margin-bottom: 8px;">
						<div style="float: left; width: 78px; font-weight: 600;">Time:</div>
						<input type="text" id="time" name="time" value="" style="width:80px">
					</div>
					
					<!-- Time Navigation Buttons & Time Increment selector -->
					<div>
						<div style="float: left; width: 78px; font-weight: 600;">Time-step:</div>
						<select id="timestep-select" name="time-step"></select>
						<span id="timeBackBtn" class="ui-icon ui-icon-circle-arrow-w" title=" - Move the Observation Date/Time backward one time-step"></span>
						<span id="timeForwardBtn" class="ui-icon ui-icon-circle-arrow-e" title=" - Move the Observation Date/Time forward one time-step"></span>
						<!-- Movie Builder -->
						<!-- <img id="movieBuilder"alt="Show movie." src="images/blackGlass/glass_button_movies.png"  title=" - Quick Movie."> -->
					</div>

				</div>
				<br><br>
				<div id="tileLayerAccordion"></div>
				<br><br>
				<div id="eventAccordion"></div>
			</div>

			<!-- Right Column -->
			<div id="right-col">
				<div id="right-col-header">
					<span id="loading" style="display: none">Loading...</span>
				</div>

				<!-- Recent Updates -->
				<div class='notes ui-widget ui-widget-content ui-corner-all'>
					<strong style="text-decoration: underline; font-size:130%; margin-bottom:10px; ">Recent Updates</strong><br><br>
                    <strong>> 04/17/2009</strong><p>Added support for all 2003 LASCO, EIT, subset of MDI data.</p><br><br>
                    <strong>> 04/17/2009</strong><p>Improved performance.</p><br><br>
                    <strong>> 04/17/2009</strong><p>Added fullscreen view support.</p><br><br>
                    <strong>> 04/17/2009</strong><p>New look and feel.</p><br><br>
				</div>
			</div>

			<!-- Middle Column -->
			<div id="middle-col">
				<div id="middle-col-header">
					<div style="position: absolute; min-width:550px; top:14px;">

						<!-- Message Console -->
						<span id="message-console-spacer" style="width:100%; position: absolute; left:0pt; display:none; font-size:1em;">&nbsp;</span><div style="height:25px;">&nbsp;</div>
					</div>
				</div>
				<!-- End middle-col-header -->

				<!-- Viewport -->
				<div id="helioviewer-viewport-container-outer" class="ui-widget ui-widget-content ui-corner-all">
					<div id="helioviewer-viewport-container-inner" class="centered" style="top:3%; width:97%; height:94%">
						<div id="helioviewer-viewport"></div>

							<!-- UI COMPONENTS -->

							<!--  Zoom-Level Slider -->
							<div id="zoomControl">
								<div id="zoomControlZoomIn" class="sliderPlus" title=" - Zoom in.">+</div>
								<div id="zoomControlTrack" class="sliderTrack">
									<div id="zoomControlHandle" class="sliderHandle" title=" - Drag handle to zoom in and out."></div>
								</div>
								<div id="zoomControlZoomOut" class="sliderMinus" title=" - Zoom out.">-</div>
							</div>
                            
                            <!-- Center button -->
                            <div id="center-button">
                                <span>center</span>
                            </div>
                            
                            <!-- Fullscreen toggle -->
                            <div id='fullscreen-btn'>
                                <div class='ui-icon ui-icon-arrow-4-diag'></div>
                            </div>

					</div>
				</div>
                
             <!-- <div style="height:250px; width:100%; float:left; font-size:0.85em"> -->
        		<div id="footer-links-container-outer">
    
    				<!-- Links -->
    				<div id="footer-links-container-inner">
                        <div id="footer-links" class="ui-corner-bottom">
        					<a id="helioviewer-about" class="light" href="dialogs/about.php">About</a>
        					<a id="helioviewer-usage" class="light" href="dialogs/usage.php">Usage Tips</a>
        					<a href="http://achilles.nascom.nasa.gov/~dmueller/" class="light" target="_blank">JHelioviewer</a>
        					<a href="wiki/" class="light" target="_blank">Wiki</a>
        					<a href="api/" class="light" target="_blank">API</a>
        					<a href="mailto:webmaster@helioviewer.org" class="light">Contact</a>
        					<a href="https://bugs.launchpad.net/helioviewer/" class="light" style="margin-right:2px;" target="_blank">Report Bug</a>
                        </div>
    				</div>
			
				<!-- Timeline -->
				<!--
				<div style="text-align: center;">
					<div id="timeline" style="height: 150px; width: 70%; margin-left: auto; margin-right: auto; border: 1px solid #000"></div>
				</div>
				-->
			</div>
                
			</div>
			<div id="clearfooter"></div>
		</div>
		<!-- end outer div -->

		<!-- Footer -->
		<div id="footer">			
		</div>
		
		<!-- About dialog -->
		<div id='about-dialog'></div>
		
        <!-- Usage Dialog -->
        <div id='usage-dialog'></div>
		
	</body>
</html>
