$(document).ready(function(){
// Bootstrap components


function openSideMenu(){
	document.getElementById("searchresults").style.display="none";
  	document.getElementById("move").style.marginRight="280px";
  	document.getElementById("side-menu").style.width="280px";
  	document.getElementById("btn-start").style.display="none";
  	document.getElementById("searchstring").style.display="none";
  	document.getElementById("searchbtn").style.display="none";
	document.getElementById("btn-cur-location").style.display="none";
	document.getElementById("select-area-help").style.display="none";
	document.getElementById("collapseSelectedArea").style.display="none";
	document.getElementById("reset-selection").style.display="none";
	defaultHandClicked();
	//map.addInteraction(draw);
}

function closeSideMenu(){
	document.getElementById("searchresults").style.display="block";
	document.getElementById("map").style.cursor = "default";
  	document.getElementById("move").style.marginRight="0";
  	document.getElementById("side-menu").style.width="0";
  	document.getElementById("btn-start").style.display="block";
  	document.getElementById("searchstring").style.display="block";
  	document.getElementById("searchbtn").style.display="block";
  	document.getElementById("btn-cur-location").style.display="block";
  	$('#collapseSelectedArea').text('');
	document.getElementById("reset-selection").style.display="none";
	document.getElementById("select-area-help").style.display="none";
	document.getElementById("view-in-osm").style.display="none";
	map.removeInteraction(draw);
	vectorsource.clear();
}

function searchID(){
	document.getElementById("view-in-osm").style.display="block";
	var urlOSMrelation = "https://www.openstreetmap.org/relation/" + document.getElementById("relation-input").value;
	var textViewRelation = '<small><a href=' + urlOSMrelation +' target="_blank">View selection in OpenStreetMap <i class="fas fa-external-link-alt"></i></a></small>';
    document.getElementById("view-in-osm").innerHTML = textViewRelation;
}


// close SideMenu when pressing <esc> key
$( document ).on( 'keydown', function ( e ) {
  if ( e.keyCode === 27 && !$('#help').is(':visible') && !$('#about').is(':visible')) {
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
	map.removeInteraction(draw);
	displayResetButton();

	if (parseFloat(topLeftLon)<parseFloat(botRightLon)){
	} else {
		var topLeftLonAUX = botRightLon;
		var botRightLonAUX = topLeftLon;
		botRightLon = botRightLonAUX;
		topLeftLon = topLeftLonAUX;
	}

	if (parseFloat(topLeftLat)>parseFloat(botRightLat)){
	} else {
		var topLeftLatAUX = botRightLat;
		var botRightLatAUX = topLeftLat;
		botRightLat = botRightLatAUX;
		topLeftLat = topLeftLatAUX;
	}

	document.getElementById("collapseSelectedArea").style.display="block";
 	$('#collapseSelectedArea').html('<i class="fas fa-arrows-alt-h"></i> Longitude<dd>' + topLeftLon  + ' - ' + botRightLon  + ' </dd>' + 
				      '<i class="fas fa-arrows-alt-v"></i> Latitude<dd>' + topLeftLat  + ' - ' + botRightLat + ' </dd>');

	$('#export-button').prop('disabled', false);
	
	document.getElementById("select-area-help").style.display="none";

	return bbox=[topLeftLon, botRightLat, botRightLon, topLeftLat];
	
		});

	function displayResetButton() {
	document.getElementById("reset-selection").style.display="block";
	}

 // What happens when we click on the HIDE button
 $('#btn-close').on('click', function() {
	closeSideMenu();
	map.removeInteraction(draw);
	vectorsource.clear();
    });

// When clicking on the "Start selection" button
$('#btn-start-selection').on('click', function() {
	document.getElementById("select-area-help").style.display="block";
	map.addInteraction(draw);
	});

	function startSelectionHideButton(){
		document.getElementById("btn-start-selection").style.display="none";
	}

	function defaultHandClicked(){
		vectorsource.clear();
		document.getElementById("select-area-start").style.display="block";
		$("#btn-hand-default").removeClass("btn btn-outline-secondary").addClass("btn btn-secondary");
		$("#btn-boundaries").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		$("#btn-start-selection").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		map.removeInteraction(draw);
		$('#export-button').prop('disabled', true);
		document.getElementById("select-area-help").style.display="none";
		document.getElementById("collapseSelectedArea").style.display="none";
		document.getElementById("reset-selection").style.display="none";
		document.getElementById("map").style.cursor = "move";
		document.getElementById("id-search-area").style.display="none";
		document.getElementById("view-in-osm").style.display="none";
		$('#relation-input').val("");
	}

	function startSelectionClicked(){
		document.getElementById("select-area-start").style.display="none";
		document.getElementById("map").style.cursor = "default";
		vectorsource.clear(); 
		map.removeInteraction(draw);
		$("#btn-start-selection").removeClass("btn btn-outline-secondary").addClass("btn btn-secondary");
		$("#btn-hand-default").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		$("#btn-boundaries").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		$('#export-button').prop('disabled', true);
		document.getElementById("select-area-help").style.display="none";
		document.getElementById("collapseSelectedArea").style.display="none";
		document.getElementById("reset-selection").style.display="none";
		document.getElementById("id-search-area").style.display="none";
		document.getElementById("view-in-osm").style.display="none";
		$('#relation-input').val("");
	}

	function boundariesClicked(){
		document.getElementById("select-area-start").style.display="none";
		document.getElementById("map").style.cursor = "default";
		//$('#boundaries').modal('show');
		document.getElementById("id-search-area").style.display="block";
		$("#btn-hand-default").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		$("#btn-boundaries").removeClass("btn btn-outline-secondary").addClass("btn btn-secondary");
		$("#btn-start-selection").removeClass("btn btn-secondary").addClass("btn btn-outline-secondary");
		vectorsource.clear(); 
		map.removeInteraction(draw);
		$('#export-button').prop('disabled', true);
		document.getElementById("select-area-help").style.display="none";
		document.getElementById("collapseSelectedArea").style.display="none";
		document.getElementById("reset-selection").style.display="none";
	}
	
	// When clicking "Reset selection" button
	$('#reset-selection-btn').on('click', function() {
	document.getElementById("btn-start-selection").style.display="block";
	vectorsource.clear(); 
	$('#collapseSelectedArea').text('');
	document.getElementById("select-area-help").style.display="block";
	document.getElementById("collapseSelectedArea").style.display="none";
	//map.removeInteraction(draw);
	map.addInteraction(draw);
	document.getElementById("reset-selection").style.display="none";
	$('#export-button').prop('disabled', true);
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
	searchstring = searchstring.trim();
	if (searchstring.includes(" ") && searchstring.match(/ /gi).length == 1){
		var words = searchstring.split(" ");
			var firstCoord = parseFloat(words[0]);
			var secondCoord = parseFloat(words[1]);
			if (firstCoord && secondCoord != "NaN"){
				chooseAddr(firstCoord, secondCoord);
			}
			else {
				nominatim(searchstring);
			}
	}
	else {
		nominatim(searchstring);
	}
    
}

function nominatim(searchstring){
	$.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q='+ searchstring, 
	function(data) {
	var items = [];
	$.each(data, function(key, val) {
	items.push("<li><a href='#' onclick='chooseAddr("+val.lat+","+val.lon+");" 
		   + "return false;'>" + val.display_name + '</a>' 
		   + "<span class='result-item-type'> (" + val.type + ")</span>"
		   + '<span class="osm-relation-id">' + ' ID:' + val.osm_id + '</span>' 
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



function change(pill, count){
	$(pill).text(document.getElementById(count).value);
}


// When pressing the "Add" button
function vehicleAdded(event, btn, vtype, defaultFactor, defaultCount, pill, card){

			if (vtype != "options") {
				if ($(btn).text() === "Add") {
					$(btn).text("Added");
					$(btn).removeClass("btn btn-secondary btn-sm float-right").addClass("btn btn-success btn-sm float-right");
					$('#'+vtype+'Factor').val(defaultFactor);
					$('#'+vtype+'Count').val(defaultCount);
					var isVisible = $(card).is( ":visible" );
					
					$(pill).text(defaultCount);
				}
				else {
					$(btn).text("Add");
					$(btn).removeClass("btn btn-success btn-sm float-right").addClass("btn btn-secondary btn-sm float-right");
					$('#'+vtype+'Factor').val("");
					$('#'+vtype+'Count').val("");
					$(pill).text("");
				}
				}
				//event.preventDefault();
}

// "Add" buttons
$('#btn-enable-cars').on('click',function(event){ vehicleAdded(event, this, 'car', 5, 12, '#car-pill', '#collapseCars'); });
$('#btn-enable-trucks').on('click',function(event){ vehicleAdded(event, this, 'truck', 5, 8, '#truck-pill'); });
$('#btn-enable-bus').on('click',function(event){ vehicleAdded(event, this, 'bus', 5, 4, '#bus-pill'); });
$('#btn-enable-motorcycles').on('click',function(event){ vehicleAdded(event, this, 'motorcycle', 2, 4, '#motorcycle-pill'); });
$('#btn-enable-bicycles').on('click',function(event){ vehicleAdded(event, this, 'bicycle', 2, 6, '#bicycle-pill'); });
$('#btn-enable-pedestrians').on('click',function(event){ vehicleAdded(event, this, 'pedestrian', 1, 10, '#pedestrian-pill'); });
$('#btn-enable-trams').on('click',function(event){ vehicleAdded(event, this, 'tram', 20, 2, '#tram-pill'); });
$('#btn-enable-urbantrains').on('click',function(event){ vehicleAdded(event, this, 'urbantrain', 40, 2, '#urbantrain-pill'); });
$('#btn-enable-trains').on('click',function(event){ vehicleAdded(event, this, 'train', 40, 2, '#train-pill'); });
$('#btn-enable-ships').on('click',function(event){ vehicleAdded(event, this, 'ship', 40, 2, '#ship-pill'); });


var socket;
    var totalSteps;
    var currentStep;
    var presentedErrorLog = false;

    /**
     * @function
     * connects to the socket, when it fails it tries it again after five seconds
     */
    function connectSocket(){
        var address = location.hostname;
        // when accessing via file, location.hostname is an empty string, so guess that the server is on localhost
        if(!address)
            address = "localhost";
        try {
            socket = new WebSocket("ws://" + address + ":" + PORT);
        } catch(e){
            // connection failed, wait five seconds, then try again
	    setTimeout(connectSocket, 5000);
            return;
        }

	socket.onerror = function(error) {
	    if (presentedErrorLog == false) {
		window.alert("Socket connection failed. Please open the OSM WebWizard by using osmWebWizard.py or the link in your start menu.");
		presentedErrorLog = true;
	    }
	};
	
        // whenever the socket closes (e.g. restart) try to reconnect
        socket.addEventListener("close", connectSocket);
        socket.addEventListener("message", function(evt){
            var message = evt.data;
            // get the first space
            var index = message.indexOf(" ");
            // split the message type from the message
            var type = message.substr(0, index);
            message = message.substr(index + 1);

            if(type === "zip"){
                showZip(message);
            } else if(type === "report"){
                currentStep++;
                elem("#status > span").textContent = message;
                elem("#status > div").style.width = (100 * currentStep / totalSteps) + "%";

                if(currentStep === totalSteps){
                    setTimeout(function(){
                        elem("#status").style.display = "none";
                    elem("#export-button").style.display = "block";
                    }, 2000);
                }
            } else if(type === "steps"){
                totalSteps = parseInt(message);
                currentStep = 0;
            }
        });
    }

    connectSocket();

    /**
     * @function
     * generate and send the data to the websocket
     */
    function startBuild(){
       
		closeSideMenu();
	$('#loading').modal('show');	
	var left = bbox[0];
	var down = bbox[1];
	var right = bbox[2];
	var up = bbox[3];
	var carFactor = document.getElementById("carFactor").value;
	if (carFactor ==""){carFactor="0"};
	var carCount = document.getElementById("carCount").value;
	if (carCount ==""){carCount="0"};
	var truckFactor = document.getElementById("truckFactor").value;
	if (truckFactor ==""){truckFactor="0"};
	var truckCount = document.getElementById("truckCount").value;
	if (truckCount ==""){truckCount="0"};
	var busFactor = document.getElementById("busFactor").value;
	if (busFactor ==""){busFactor="0"};
	var busCount = document.getElementById("busCount").value;
	if (busCount ==""){busCount="0"};
	var motorcycleFactor = document.getElementById("motorcycleFactor").value;
	if (motorcycleFactor ==""){motorcycleFactor="0"};
	var motorcycleCount = document.getElementById("motorcycleCount").value;
	if (motorcycleCount ==""){motorcycleCount="0"};
	var bicycleFactor = document.getElementById("bicycleFactor").value;
	if (bicycleFactor ==""){bicycleFactor="0"};
	var bicycleCount = document.getElementById("bicycleCount").value;
	if (bicycleCount ==""){bicycleCount="0"};
	var pedestrianFactor = document.getElementById("pedestrianFactor").value;
	if (pedestrianFactor ==""){pedestrianFactor="0"};
	var pedestrianCount = document.getElementById("pedestrianCount").value;
	if (pedestrianCount ==""){pedestrianCount="0"};
	var tramFactor = document.getElementById("tramFactor").value;
	if (tramFactor ==""){tramFactor="0"};
	var tramCount = document.getElementById("tramCount").value;
	if (tramCount ==""){tramCount="0"};
	var urbantrainFactor = document.getElementById("urbantrainFactor").value;
	if (urbantrainFactor ==""){urbantrainFactor="0"};
	var urbantrainCount = document.getElementById("urbantrainCount").value;
	if (urbantrainCount ==""){urbantrainCount="0"};
	var trainFactor = document.getElementById("trainFactor").value;
	if (trainFactor ==""){trainFactor="0"};
	var trainCount = document.getElementById("trainCount").value;
	if (trainCount ==""){trainCount="0"};
	var shipFactor = document.getElementById("shipFactor").value;
	if (shipFactor ==""){shipFactor="0"};
	var shipCount = document.getElementById("shipCount").value;
	if (shipCount ==""){shipCount="0"};
	var scenarioDuration = document.getElementById("duration").value;
	if (scenarioDuration ==""){scenarioDuration="3600"};
	var polygons = document.getElementById("polygons").checked;
	var publicTransport = document.getElementById("publicTransport").checked;
	var leftHand = document.getElementById("leftHand").checked;

	var data = {
		poly: polygons,
		duration: scenarioDuration,
		publicTransport: publicTransport,
		leftHand: leftHand,
		coords: [bbox[1],bbox[0],bbox[3],bbox[2]],
		vehicles: {}
	};


        try {
            socket.send(JSON.stringify(data));
        } catch(e){
            return;
        }

		elem("#status").style.display = "block";
        elem("#export-button").style.display = "none";
    }

    elem("#export-button").on("click", startBuild);

	function showZip(uri){
        var url = "data:application/zip;base64," + uri;

        // using a temporarily link to trigger the download dialog
        var link = elem("<a>", {
            download: "osm.zip",
            href: url,
            target: "_blank"
        });

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
	}
	
});
	

