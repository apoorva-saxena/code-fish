(function(exports) {

  function initMap() {
    var currentUser;
    var socket = io();
    socket.on('current user', function(data) {
      currentUser = data.user;
      console.log(currentUser);
      var citiesContacted = currentUser.citiesContacted;
      console.log(citiesContacted);

      geocoder = new google.maps.Geocoder();

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: { lat: 0, lng:0},
        styles: [
  {
    "featureType": "water",
    "stylers": [
      { "color": "#517DE7" }
    ]
  },
   {
    "featureType": "landscape",
    "stylers": [
      { "color": "#e7bb51" }
    ]
  }
]
      });
    
      for(var i = 0; i < citiesContacted.length; i++) {
      console.log('calling for:');
      console.log(citiesContacted[i]);
      codeAddress(citiesContacted[i]);
      }
    });
  }

  function codeAddress(address) {
    geocoder.geocode( {address:address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({ map: map,
                                              position: results[0].geometry.location
                                            });
      }
    });
  }

exports.initMap = initMap;
})(this);
