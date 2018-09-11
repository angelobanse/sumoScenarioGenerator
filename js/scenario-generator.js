$('#btn-cur-location').on('click', function(event) {
	if(!navigator.geolocation) return;
        else navigator.geolocation.getCurrentPosition(function(position){
            chooseAddr(position.coords.latitude, position.coords.longitude)
        });
    });

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

function chooseAddr(lat, lng) {
    $('#searchresults').empty();
    var newlocation = ol.proj.transform([lng,lat], 'EPSG:4326', 'EPSG:3857');
    var view = map.getView();
    view.setCenter(newlocation);
    view.setZoom(16);
}




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
