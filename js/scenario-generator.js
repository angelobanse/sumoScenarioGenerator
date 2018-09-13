
// Bootstrap components
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover(); 
  });


function openSideMenu(){
  document.getElementById("side-menu").style.width="350px";
  document.getElementById("btn-start").style.display="none";
  document.getElementById("searchstring").style.display="none";
  document.getElementById("searchbtn").style.display="none";
	document.getElementById("btn-cur-location").style.display="none";
	map.addInteraction(draw);
}

function closeSideMenu(){
  document.getElementById("side-menu").style.width="0";
  document.getElementById("btn-start").style.display="block";
  document.getElementById("searchstring").style.display="block";
  document.getElementById("searchbtn").style.display="block";
  document.getElementById("btn-cur-location").style.display="block";
	$('#collapseSelectedArea').text('No area selected');
	map.removeInteraction(draw);
	vectorsource.clear();
}

// close SideMenu when pressing <esc> key
$( document ).on( 'keydown', function ( e ) {
  if ( e.keyCode === 27 ) {
	  closeSideMenu();
  }
});


// ============================== MAP ==============================

var vectorsource;
var draw;

vectorsource = new ol.source.Vector({wrapX: false});
    var vector = new ol.layer.Vector({
        source : vectorsource,
        style: new ol.style.Style({
          fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
          stroke: new ol.style.Stroke({ color: '#30a64a', width: 4    }),
          image: new ol.style.Circle({ radius: 7, fill: new ol.style.Fill({ color: '#ffcc33' }) })
        })
    });

var raster = new ol.layer.Tile({source: new ol.source.OSM()});

var map = new ol.Map({
	target: 'map',
	layers: [raster, vector],
	view: new ol.View({
	  center: ol.proj.transform([13.52822,52.4283], 'EPSG:4326', 'EPSG:3857'),
	  zoom: 16
	})
  });

  var mousePosition = new ol.control.ScaleLine({
  units: 'metric',
  minWidth: 100
	});
map.addControl(mousePosition);

var geometryFunction = function(coordinates, geometry) {
	if (!geometry) { geometry = new ol.geom.Polygon(null); }
        
	var start = coordinates[0];
  var end = coordinates[1];
  geometry.setCoordinates([
  [start, [start[0], end[1]], end, [end[0], start[1]], start]
  ]);
        
	return geometry;
};

draw = new ol.interaction.Draw({
	source: vectorsource,
  type: ('LineString'),
  geometryFunction: geometryFunction,
  maxPoints: 2
});


// Remove previous drawings when start drawing again
draw.on('drawstart', function(e) { 
	vectorsource.clear(); 
});

// Finish drawing
draw.on('drawend', function(event) {
	var coords = event.feature.getGeometry().getCoordinates();
	var topLeft = ol.proj.transform(coords[0][0], 'EPSG:3857', 'EPSG:4326');
	var topLeftLon = topLeft[0].toFixed(5);
	var topLeftLat = topLeft[1].toFixed(5);
	var botRight = ol.proj.transform(coords[0][2], 'EPSG:3857', 'EPSG:4326');
	var botRightLon = botRight[0].toFixed(5);
	var botRightLat = botRight[1].toFixed(5);
	displayResetButton();

	if (parseFloat(topLeftLon)<parseFloat(botRightLon)){
		console.log("ok");
	} else {
		var topLeftLonAUX = botRightLon;
		var botRightLonAUX = topLeftLon;
		botRightLon = botRightLonAUX;
		topLeftLon = topLeftLonAUX;
	}

	if (parseFloat(topLeftLat)>parseFloat(botRightLat)){
		console.log("ok");
	} else {
		var topLeftLatAUX = botRightLat;
		var botRightLatAUX = topLeftLat;
		botRightLat = botRightLatAUX;
		topLeftLat = topLeftLatAUX;
	}

		
 	$('#collapseSelectedArea').html('<i class="fas fa-arrows-alt-h"></i> Longitude<dd>' + topLeftLon  + ' - ' + botRightLon  + ' </dd>' + 
				      '<i class="fas fa-arrows-alt-v"></i> Latitude<dd>' + topLeftLat  + ' - ' + botRightLat  +
							'</dl>');

	$('#btn-generate').prop('disabled', false);

	return bbox=[topLeftLon, botRightLat, botRightLon, topLeftLat];
	
		});
		

    // If the window is resized, we have to update the map accordingly
    $(window).resize(function() { 
	setTimeout( function() { map.updateSize();}, 200);
    });


		function displayResetButton() {
			document.getElementById("reset-selection").style.display="block";
		}


    // What happenes when we click on the GENERATE button in the side bar?
    $('#btn-generate').on('click', function() {
			var left = this.topLeftLon;
		var down = this.botRightLat;
		var right = this.botRightLon;
		var up = this.topLeftLat;
		closeSideMenu();
		$('#help').modal('show');

		
		var latlongBBOX = bbox;
		var carFactor = document.getElementById("carFactor").value;
		var carCount = document.getElementById("carCount").value;
		var truckFactor = document.getElementById("truckFactor").value;
		var truckCount = document.getElementById("truckCount").value;
		var busFactor = document.getElementById("busFactor").value;
		var busCount = document.getElementById("busCount").value;
		var motorcycleFactor = document.getElementById("motorcycleFactor").value;
		var motorcycleCount = document.getElementById("motorcycleCount").value;
		var bicycleFactor = document.getElementById("bicycleFactor").value;
		var bicycleCount = document.getElementById("bicycleCount").value;
		var pedestrianFactor = document.getElementById("pedestrianFactor").value;
		var pedestrianCount = document.getElementById("pedestrianCount").value;
		var tramFactor = document.getElementById("tramFactor").value;
		var tramCount = document.getElementById("tramCount").value;
		var urbantrainFactor = document.getElementById("urbantrainFactor").value;
		var urbantrainCount = document.getElementById("urbantrainCount").value;
		var trainFactor = document.getElementById("trainFactor").value;
		var trainCount = document.getElementById("trainCount").value;
		var shipFactor = document.getElementById("shipFactor").value;
		var shipCount = document.getElementById("shipCount").value;
		var scenarioDuration = document.getElementById("scenario-duration").value;
		var polygons = document.getElementById("add-polygons").value;
    });







    // What happens when we click on the CANCEL button in the side bar?
    $('#btn-close').on('click', function() {
	closeSideMenu();
	map.removeInteraction(draw);
	vectorsource.clear();
    });

		// When clicking "Reset selection" button
		$('#reset-selection').on('click', function() {
			vectorsource.clear(); 
			$('#collapseSelectedArea').text('No area selected');
			document.getElementById("reset-selection").style.display="none";
			$('#btn-generate').prop('disabled', true);
				});




// Get current location
$('#btn-cur-location').on('click', function(event) {
	if(!navigator.geolocation) return;
        else navigator.geolocation.getCurrentPosition(function(position){
            chooseAddr(position.coords.latitude, position.coords.longitude)
        });
    });


// Search
function search() {
    var searchstring = $('#searchstring').val();

    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q='+ searchstring, 
	      function(data) {
		  var items = [];
		  $.each(data, function(key, val) {
		  items.push("<li><a href='#' onclick='chooseAddr("+val.lat+","+val.lon+");" 
			     + "return false;'>" + val.display_name + '</a>' 
			     + "<span class='result-item-type'>(" + val.type + ")</span>" 
			     + "</li>");
		  });

		  $('#searchresults').empty();
		  if (items.length != 0) {
		      $('<ul/>', { 'class' : 'resultitems', html: items.join('')}).appendTo('#searchresults');
		  } else {
		      $('<p>', { html: "<center>No results found</center>" }).appendTo('#searchresults');
		  }
	      });
}


// Go to selected search result
function chooseAddr(lat, lng) {
    $('#searchresults').empty();
    var newlocation = ol.proj.transform([lng,lat], 'EPSG:4326', 'EPSG:3857');
    var view = map.getView();
    view.setCenter(newlocation);
    view.setZoom(16);
}



// When pressing the "Add" button
function vehicleAdded(event, btn, vtype, defaultFactor, defaultCount){

			// Are we handling a vehicle type or options button?
			if (vtype != "options") {
				if ($(btn).text() === "Add") {
					$(btn).text("Added");
					$(btn).removeClass("btn btn-secondary btn-sm float-right").addClass("btn btn-success btn-sm float-right");
					$('#'+vtype+'Factor').val(defaultFactor);
					$('#'+vtype+'Count').val(defaultCount);
					window[vtype+'Enabled'] = true;
				}
				else {
					$(btn).text("Add");
					$(btn).removeClass("btn btn-success btn-sm float-right").addClass("btn btn-secondary btn-sm float-right");
					window[vtype+'Enabled'] = false;
				}
				}
			
				// we are handling the show options button
				else {
				if ($(btn).text() === "Show")   
					$(btn).text("Hide");	
				else 
					$(btn).text("Show");
				
				}
			
				// Show or hide the panel
				$('#generate-'+vtype+'-panel').collapse('toggle');
				
				// prevent the submission of the form by clicking this button
				event.preventDefault();
}

// "Add" buttons
$('#btn-enable-cars').on('click',function(event){ vehicleAdded(event, this, 'car', 5, 12); });
$('#btn-enable-trucks').on('click',function(event){ vehicleAdded(event, this, 'truck', 5, 8); });
$('#btn-enable-bus').on('click',function(event){ vehicleAdded(event, this, 'bus', 5, 4); });
$('#btn-enable-motorcycles').on('click',function(event){ vehicleAdded(event, this, 'motorcycle', 2, 4); });
$('#btn-enable-bicycles').on('click',function(event){ vehicleAdded(event, this, 'bicycle', 2, 6); });
$('#btn-enable-pedestrians').on('click',function(event){ vehicleAdded(event, this, 'pedestrian', 1, 10); });
$('#btn-enable-trams').on('click',function(event){ vehicleAdded(event, this, 'tram', 20, 2); });
$('#btn-enable-urbantrains').on('click',function(event){ vehicleAdded(event, this, 'urbantrain', 40, 2); });
$('#btn-enable-trains').on('click',function(event){ vehicleAdded(event, this, 'train', 40, 2); });
$('#btn-enable-ships').on('click',function(event){ vehicleAdded(event, this, 'ship', 40, 2); });
